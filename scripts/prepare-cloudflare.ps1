param(
    [string]$SiteUrl = 'https://shreenarnarayanchildrenhospital.in'
)

$ErrorActionPreference = 'Stop'
$repositoryRoot = Split-Path $PSScriptRoot -Parent
$outputDirectory = Join-Path $repositoryRoot 'dist'
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
$publicFiles = @('index.html', 'styles.css', 'script.js', 'favicon.svg', '404.html', 'robots.txt', 'sitemap.xml')
foreach ($publicFile in $publicFiles) {
    Copy-Item -LiteralPath (Join-Path $repositoryRoot $publicFile) -Destination $outputDirectory -Force
}
Copy-Item -LiteralPath (Join-Path $repositoryRoot 'images') -Destination $outputDirectory -Recurse -Force
foreach ($metadataFile in @('index.html', 'robots.txt', 'sitemap.xml')) {
    $metadataPath = Join-Path $outputDirectory $metadataFile
    $content = [System.IO.File]::ReadAllText($metadataPath)
    $content = $content.Replace('https://shreenarnarayanhospital.in', $SiteUrl.TrimEnd('/'))
    [System.IO.File]::WriteAllText($metadataPath, $content, [System.Text.UTF8Encoding]::new($false))
}
Write-Output "Public website prepared in $outputDirectory for $SiteUrl"
