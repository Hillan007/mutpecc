# Download cinematic animal photos from Unsplash Source and save to public/people
# Run from repository root: powershell -ExecutionPolicy Bypass -File .\scripts\download-people-images.ps1

$dest = "public/people"
if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }

# Ensure TLS 1.2 (common reason for "connection closed" errors)
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$images = @(
    @{ url = 'https://source.unsplash.com/640x640/?lion,cinematic'; file = 'leader-1.jpg' },
    @{ url = 'https://source.unsplash.com/640x640/?tiger,cinematic'; file = 'leader-2.jpg' },
    @{ url = 'https://source.unsplash.com/640x640/?wolf,cinematic'; file = 'leader-3.jpg' },
    @{ url = 'https://source.unsplash.com/640x640/?bear,cinematic'; file = 'leader-4.jpg' },
    @{ url = 'https://source.unsplash.com/640x640/?eagle,cinematic'; file = 'leader-5.jpg' },
    @{ url = 'https://source.unsplash.com/640x640/?fox,cinematic'; file = 'leader-6.jpg' },
    @{ url = 'https://source.unsplash.com/640x640/?owl,wise'; file = 'counselor.jpg' }
)

Write-Host "Downloading images to $dest" -ForegroundColor Cyan
foreach ($img in $images) {
    $outPath = Join-Path $dest $img.file
    Write-Host "Downloading $($img.url) -> $outPath"

    $maxAttempts = 3
    $attempt = 0
    $success = $false

    while (-not $success -and $attempt -lt $maxAttempts) {
        $attempt++
        try {
            Invoke-WebRequest -Uri $img.url -OutFile $outPath -Headers @{ 'User-Agent' = 'Mozilla/5.0' } -ErrorAction Stop
            $success = $true
        } catch {
            Write-Host "Attempt $attempt failed: $($_.Exception.Message)" -ForegroundColor Yellow
            if ($attempt -lt $maxAttempts) { Start-Sleep -Seconds (2 * $attempt) }
        }
    }

    if (-not $success) {
        Write-Host "Failed to download $($img.url) after $maxAttempts attempts." -ForegroundColor Red
    }
}

Write-Host "Done. Review images in $dest and commit them if satisfied." -ForegroundColor Green
