@echo off

REM Create or overwrite the .env file with required variables
(
echo JWT_SECRET=thIs_is_nOt_A_TOkEn
echo MONGO_URI=mongodb+srv://suii:suii@cluster0.wkaot.mongodb.net/?retryWrites=true^&w=majority^&appName=Cluster0
echo Hugging_face_token=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
) > .env

echo .env file created successfully.

REM Install Python requirements
if exist requirements.txt (
    echo Installing dependencies from requirements.txt...
    pip install -r requirements.txt
) else (
    echo requirements.txt not found!
)

echo Setup complete.