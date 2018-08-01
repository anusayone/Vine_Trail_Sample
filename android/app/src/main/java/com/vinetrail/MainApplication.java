package com.vinetrail;

import android.app.Application;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import com.zmxv.RNSound.RNSoundPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.reactlibrary.googlesignin.RNGoogleSignInPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.smixx.fabric.FabricPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.reactlibrary.googlesignin.RNGoogleSignInPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.reactlibrary.googlesignin.RNGoogleSignInPackage;

import java.util.Arrays;
import java.util.List;

import com.smixx.fabric.FabricPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import com.brentvatne.react.ReactVideoPackage;
import com.rnfs.RNFSPackage;
import com.marianhello.bgloc.react.BackgroundGeolocationPackage;  // <--- Import Package
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;  // <--- Import Package

import com.imagepicker.ImagePickerPackage; // <-- add this import

public class MainApplication extends Application implements ReactApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new FabricPackage(),
                    new MainReactPackage(),
                    new RNSoundPackage(),
                    new RNFetchBlobPackage(),
                    new MapsPackage(),
                    new RNGoogleSignInPackage(),
                    new FBSDKPackage(mCallbackManager),
                    new ReactNativePushNotificationPackage(),
                    new ReactVideoPackage(),
                    new BackgroundGeolocationPackage(),
                    new RNFSPackage(), // <---------- add package// <---- Add the Package
            new ImagePickerPackage() // <-- add this
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Fabric.with(this, new Crashlytics());
        SoLoader.init(this, /* native exopackage */ false);
        FacebookSdk.sdkInitialize(getApplicationContext());
        // If you want to use AppEventsLogger to log events.
        AppEventsLogger.activateApp(this);

    }
}
