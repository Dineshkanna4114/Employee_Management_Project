@echo off
echo ============================================
echo   Employee Management System - Backend
echo ============================================

:: Set Maven path (using local maven)
set MAVEN_HOME=%~dp0..\maven\apache-maven-3.9.6
set PATH=%MAVEN_HOME%\bin;%PATH%

echo [1/2] Checking Java version...
java -version

echo.
echo [2/2] Starting Spring Boot backend...
echo    URL: http://localhost:8080/api
echo.
echo Default credentials:
echo    Admin: admin / admin123
echo    User:  user  / user123
echo.

cd /d %~dp0
call mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Djava.version=17"

pause
