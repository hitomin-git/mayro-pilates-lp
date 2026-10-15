$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

# Stop after any failed Git command; never force-push either branch.
function Invoke-Git {
    & git @args
    if ($LASTEXITCODE -ne 0) { throw 'Git command failed. Publication stopped.' }
}

Invoke-Git fetch origin
Invoke-Git push origin HEAD:master
$pageCommit = Invoke-Git commit-tree HEAD:dist -p origin/gh-pages -m 'Publish reservation preference page'
Invoke-Git push origin "${pageCommit}:refs/heads/gh-pages"
Write-Host 'Published to GitHub. Pages deployment may take a few minutes.'
Write-Host 'https://mayro-pilates.com/reservation/'
