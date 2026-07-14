using System.Text;
using MediLink.Api.Models;

namespace MediLink.Api.Services;

public class PrescriptionStorageService : IPrescriptionStorageService
{
    private readonly IWebHostEnvironment _environment;

    public PrescriptionStorageService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<List<PrescriptionFileResponse>> GetByAbhaIdAsync(string abhaId)
    {
        var folderPath = GetPrescriptionsFolderPath();
        if (!Directory.Exists(folderPath))
        {
            return new List<PrescriptionFileResponse>();
        }

        var safeAbhaId = SanitizeFileSegment(abhaId);
        var files = Directory.GetFiles(folderPath, $"{safeAbhaId}_*.txt")
            .OrderByDescending(x => x)
            .ToList();

        var rows = new List<PrescriptionFileResponse>();
        foreach (var file in files)
        {
            rows.Add(new PrescriptionFileResponse
            {
                FileName = Path.GetFileName(file),
                CreatedOn = File.GetCreationTime(file),
                Content = await File.ReadAllTextAsync(file)
            });
        }

        return rows;
    }

    public async Task<string> SaveAsync(AddPrescriptionRequest request)
    {
        var safeAbhaId = SanitizeFileSegment(request.AbhaId);
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

        var folderPath = GetPrescriptionsFolderPath();
        Directory.CreateDirectory(folderPath);

        var fileName = $"{safeAbhaId}_{timestamp}.txt";
        var filePath = Path.Combine(folderPath, fileName);

        var fileContent = new StringBuilder()
            .AppendLine($"Date: {request.Date:yyyy-MM-dd}")
            .AppendLine($"Name: {request.PatientName}")
            .AppendLine($"Age: {request.Age}")
            .AppendLine("Prescription:")
            .AppendLine(request.PrescriptionText)
            .AppendLine($"Doctor's Signature: {request.DoctorSignature}")
            .ToString();

        await File.WriteAllTextAsync(filePath, fileContent);
        return fileName;
    }

    private string GetPrescriptionsFolderPath()
    {
        return Path.Combine(_environment.ContentRootPath, "Prescriptions");
    }

    private static string SanitizeFileSegment(string value)
    {
        var invalid = Path.GetInvalidFileNameChars();
        var sanitizedChars = value.Select(c => invalid.Contains(c) ? '_' : c).ToArray();
        return new string(sanitizedChars).Replace(' ', '_');
    }
}
