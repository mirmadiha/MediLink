using MediLink.Api.Models;

namespace MediLink.Api.Services;

public interface IPrescriptionStorageService
{
    Task<List<PrescriptionFileResponse>> GetByAbhaIdAsync(string abhaId);
    Task<string> SaveAsync(AddPrescriptionRequest request);
    Task<List<PrescriptionFileResponse>> GetReportsByAbhaIdAsync(string abhaId);
    Task<string> SaveReportAsync(string abhaId, string title, string reportType, string reportDate, string hospital, string notes, string content);
}
