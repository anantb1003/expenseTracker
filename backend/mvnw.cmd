@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%" == "" @ECHO OFF
@SETLOCAL

SET ERROR_CODE=0

SET __EXEC_DIR=%~dp0
SET __JAVA_EXEC=java.exe

SET WRAPPER_JAR="%__EXEC_DIR%.mvn\wrapper\maven-wrapper.jar"

IF NOT EXIST %WRAPPER_JAR% (
    echo Downloading Maven Wrapper JAR...
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar', %WRAPPER_JAR%)"
)

%__JAVA_EXEC% "-Dmaven.multiModuleProjectDirectory=%__EXEC_DIR%\" -classpath %WRAPPER_JAR% org.apache.maven.wrapper.MavenWrapperMain %*
IF ERRORLEVEL 1 SET ERROR_CODE=1

@ENDLOCAL & exit /b %ERROR_CODE%
