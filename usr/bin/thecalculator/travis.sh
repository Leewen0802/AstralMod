if [ $STAGE = "script" ]; then
  if [ $TRAVIS_OS_NAME = "linux" ]; then
    echo "[TRAVIS] Preparing build environment"
    source /opt/qt510/bin/qt510-env.sh
    echo "[TRAVIS] Building and installing the-libs"
    git clone https://github.com/vicr123/the-libs.git
    cd the-libs
    git checkout blueprint
    qmake
    make
    sudo make install INSTALL_ROOT=/
    cd ..
    echo "[TRAVIS] Running qmake"
    qmake
    echo "[TRAVIS] Building project"
    make
    echo "[TRAVIS] Installing into appdir"
    make install INSTALL_ROOT=~/appdir
    git clone https://github.com/vicr123/contemporary-icons.git
    cp contemporary-icons/apps/16/accessories-calculator.svg ~/appdir/accessories-calculator.svg
    cd ~
    echo "[TRAVIS] Getting linuxdeployqt"
    wget -c -nv "https://github.com/probonopd/linuxdeployqt/releases/download/continuous/linuxdeployqt-continuous-x86_64.AppImage"
    chmod a+x linuxdeployqt-continuous-x86_64.AppImage
    echo "[TRAVIS] Building AppImage"
    ./linuxdeployqt-continuous-x86_64.AppImage appdir/usr/share/applications/*.desktop -bundle-non-qt-libs
    ./linuxdeployqt-continuous-x86_64.AppImage appdir/usr/share/applications/*.desktop -appimage
  else
    echo "[TRAVIS] Building for macOS"
    export PATH="/usr/local/opt/bison/bin:/usr/local/opt/flex/bin:/usr/local/opt/qt/bin:$PATH"
    cd ..
    echo "[TRAVIS] Building and installing the-libs"
    git clone https://github.com/vicr123/the-libs.git
    cd the-libs
    git checkout blueprint
    qmake
    make
    sudo make install INSTALL_ROOT=/
    cd ..
    mkdir "build-thecalculator"
    cd "build-thecalculator"
    echo "[TRAVIS] Running qmake"
    qmake "INCLUDEPATH += /usr/local/opt/qt/include" "LIBS += -L/usr/local/opt/qt/lib" ../thecalculator/theCalculator.pro
    echo "[TRAVIS] Building project"
    cp ../thecalculator/icon.icns ./
    make
    echo "[TRAVIS] Embedding the-libs"
    mkdir theCalculator.app/Contents/Libraries
    cp  /usr/local/lib/libthe-libs*.dylib theCalculator.app/Contents/Libraries/
    install_name_tool -change libthe-libs.1.dylib @executable_path/../Libraries/libthe-libs.1.dylib theCalculator.app/Contents/MacOS/theCalculator
    install_name_tool -change @rpath/QtWidgets.framework/Versions/5/QtWidgets @executable_path/../Frameworks/QtSvg.framework/Versions/5/QtWidgets theCalculator.app/Contents/Libraries/libthe-libs.1.dylib
    install_name_tool -change @rpath/QtWidgets.framework/Versions/5/QtGui @executable_path/../Frameworks/QtSvg.framework/Versions/5/QtGui theCalculator.app/Contents/Libraries/libthe-libs.1.dylib
    install_name_tool -change @rpath/QtWidgets.framework/Versions/5/QtCore @executable_path/../Frameworks/QtSvg.framework/Versions/5/QtCore theCalculator.app/Contents/Libraries/libthe-libs.1.dylib
    echo "[TRAVIS] Deploying Qt Libraries"
    macdeployqt theCalculator.app
    echo "[TRAVIS] Preparing Disk Image creator"
    cp -r theCalculator.app ../thecalculator/
    cd ../thecalculator
    npm install appdmg
    echo "[TRAVIS] Building Disk Image"
    ./node_modules/appdmg/bin/appdmg.js node-appdmg-config.json ~/theCalculator-macOS.dmg
  fi
elif [ $STAGE = "before_install" ]; then
  if [ $TRAVIS_OS_NAME = "linux" ]; then
    wget -O ~/vicr12345.gpg.key https://vicr123.com/repo/apt/vicr12345.gpg.key
    sudo apt-key add ~/vicr12345.gpg.key
    sudo add-apt-repository 'deb https://vicr123.com/repo/apt/ubuntu bionic main'
    sudo add-apt-repository -y ppa:beineri/opt-qt-5.10.0-xenial
    sudo apt-get update -qq
    sudo apt-get install qt510-meta-minimal qt510x11extras qt510tools qt510translations qt510svg qt510websockets xorg-dev libxcb-util0-dev libgl1-mesa-dev flex bison
  else
    echo "[TRAVIS] Preparing to build for macOS"
    brew update
    brew install qt5 bison flex
  fi
elif [ $STAGE = "after_success" ]; then
  if [ $TRAVIS_OS_NAME = "linux" ]; then
    echo "[TRAVIS] Publishing AppImage"
    cd ~
    wget -c https://github.com/probonopd/uploadtool/raw/master/upload.sh
    bash upload.sh theCalculator*.AppImage*
  else
    echo "[TRAVIS] Publishing Disk Image"
    cd ~
    wget -c https://github.com/probonopd/uploadtool/raw/master/upload.sh
    bash upload.sh theCalculator-macOS.dmg
  fi
fi
