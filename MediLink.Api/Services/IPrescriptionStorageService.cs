using MediLink.Api.Models;

namespace MediLink.Api.Services;

public interface IPrescriptionStorageService
{
    Task<List<PrescriptionFileResponse>> GetByAbhaIdAsync(string abhaId);
    Task<string> SaveAsync(AddPrescriptionRequest request);
}
