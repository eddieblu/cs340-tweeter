# update-layer.ps1
$source = "node_modules"
$dest   = "layer\nodejs"

Write-Host "Removing existing '$dest'..."
if (Test-Path $dest) {
    Remove-Item -Recurse -Force $dest
}

Write-Host "Recreating '$dest'..."
New-Item -ItemType Directory -Path $dest | Out-Null

Write-Host "Copying '$source' to '$dest'..."
Copy-Item -Recurse -Force $source $dest

Write-Host "Done updating layer."
