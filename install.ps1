# FITogether Claude Skills — Windows 전역 설치 스크립트
# 사용법: cd fitogether-claude-tools; .\install.ps1

$SKILLS = @(
    "andrepathy",
    "claude-video",
    "superpower",
    "understand",
    "agent-memory",
    "skill-creator",
    "remotion",
    "frontend-design",
    "humanizer",
    "find-skill"
)

Write-Host "FITogether Claude Skills 설치 중..." -ForegroundColor Cyan

foreach ($skill in $SKILLS) {
    $dest = "$HOME\.claude\skills\$skill"
    New-Item -ItemType Directory -Force -Path $dest | Out-Null
    Copy-Item ".claude\skills\$skill\SKILL.md" "$dest\SKILL.md"
    Write-Host "  OK $skill" -ForegroundColor Green
}

Write-Host ""
Write-Host "완료! $($SKILLS.Count)개 스킬이 $HOME\.claude\skills 에 설치됐습니다." -ForegroundColor Cyan
Write-Host "Claude Code를 재시작하면 스킬이 자동으로 로드됩니다." -ForegroundColor Cyan
