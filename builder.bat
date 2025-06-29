@echo off
rd /S /Q output
mkdir output
cd behavior_packs
mkdir SlashBladeV4
xcopy /Y /E .\SlashBlade .\SlashBladeV4
cd ..
cd resource_packs
mkdir SlashBladeV4
xcopy /Y /E .\SlashBlade .\SlashBladeV4
cd ..
python builder.py
"C:\Program Files\7-Zip\7z.exe" a -tzip ./output/SlashBladeV4B.zip .\behavior_packs\SlashBladeV4
"C:\Program Files\7-Zip\7z.exe" a -tzip ./output/SlashBladeV4R.zip .\resource_packs\SlashBladeV4
rename output\SlashBladeV4B.zip SlashBladeV4B.mcpack
rename output\SlashBladeV4R.zip SlashBladeV4R.mcpack
rd /S /Q behavior_packs\SlashBladeV4
rd /S /Q resource_packs\SlashBladeV4
del output\SlashBladeV4B.zip
del output\SlashBladeV4R.zip
echo Addon files have been built and renamed successfully.
pause