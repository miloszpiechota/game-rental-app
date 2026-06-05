param(
  [switch]$SkipMinikubeStart,
  [switch]$SkipBuild,
  [switch]$PortForward,
  [int]$FrontendPort = 8080
)

$ErrorActionPreference = "Stop"

function Invoke-Step {
  param(
    [string]$Name,
    [scriptblock]$Command
  )

  Write-Host ""
  Write-Host "==> $Name" -ForegroundColor Cyan
  & $Command

  if ($LASTEXITCODE -ne 0) {
    throw "$Name failed with exit code $LASTEXITCODE"
  }
}

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $ProjectRoot

if (-not $SkipMinikubeStart) {
  Invoke-Step "Starting Minikube" {
    minikube start
  }
}

if (-not $SkipBuild) {
  Invoke-Step "Building backend image in Minikube" {
    minikube image build -t game-rental-backend:latest -f Dockerfile.backend .
  }

  Invoke-Step "Building frontend image in Minikube" {
    minikube image build -t game-rental-frontend:latest -f Dockerfile.frontend .
  }
}

Invoke-Step "Applying Kubernetes manifests" {
  kubectl apply -f k8s/
}

Invoke-Step "Restarting backend and frontend deployments" {
  kubectl rollout restart deployment/backend deployment/frontend -n gralnia
}

Invoke-Step "Waiting for backend rollout" {
  kubectl rollout status deployment/backend -n gralnia
}

Invoke-Step "Waiting for frontend rollout" {
  kubectl rollout status deployment/frontend -n gralnia
}

Invoke-Step "Current pods" {
  kubectl get pods -n gralnia
}

Invoke-Step "Current services" {
  kubectl get svc -n gralnia
}

Write-Host ""
Write-Host "Redeploy complete." -ForegroundColor Green

if ($PortForward) {
  Write-Host "Starting frontend port-forward on http://127.0.0.1:$FrontendPort"
  kubectl port-forward -n gralnia svc/frontend "$FrontendPort`:80"
} else {
  Write-Host "Open frontend with:"
  Write-Host "kubectl port-forward -n gralnia svc/frontend $FrontendPort`:80"
  Write-Host "http://127.0.0.1:$FrontendPort"
}
