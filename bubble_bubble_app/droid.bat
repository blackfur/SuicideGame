@setlocal
@set package=org.june.android.game.bb
@set component=%package%/.MainActivity
@set test_flags=-e class %package%.MainActivityTest#testLog
@set logcat_tag=#org.june.android#
@set debugjks=C:\Users\Administrator.PC-20150720BPSO\.android\debug.keystore
@set debugjksAlias=AndroidDebugKey
@set project=amap-demo
@set alias=%debugjksAlias%
@rem set DEVICE=-s 192.168.3.121:5555
@rem set DEVICE=-s emulator-5554
set DEVICE=%device% TZ1876FNZP
@set module=%project%
@rem set keystore=%project%.jks
@set keystore=%debugjks%
@set storepass=android
@set keypass=%storepass%
@rem @set apk=bin\%project%-debug.apk
@set keycode=4
@set TARGET=%module%\build\outputs\apk\%module%-release-unsigned.apk
@set directory=E:/work/driverstore
call g:\june-toolkit-windows\droid.bat %*
