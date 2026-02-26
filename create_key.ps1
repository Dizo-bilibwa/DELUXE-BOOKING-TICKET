# Create SSH key with proper input handling
$pinfo = New-Object System.Diagnostics.ProcessStartInfo
$pinfo.FileName = "C:\Program Files\Git\usr\bin\ssh-keygen.exe"
$pinfo.Arguments = "-t ed25519 -C ahmad@example.com -f C:\Users\ahmad\.ssh\id_ed25519 -N  -q"
$pinfo.RedirectStandardInput = $true
$pinfo.RedirectStandardOutput = $true
$pinfo.RedirectStandardError = $true
$pinfo.UseShellExecute = $false
$pinfo.CreateNoWindow = $true

$p = New-Object System.Diagnostics.Process
$p.StartInfo = $pinfo
$p.Start() | Out-Null

# Send empty passphrase twice (for confirmation)
$p.StandardInput.WriteLine("")
$p.StandardInput.WriteLine("")

$p.WaitForExit()
Write-Host "Exit code: $($p.ExitCode)"
