package com.tdnr.dhbw2go;

import android.os.Bundle;
import org.apache.cordova.*;

public class DHBW2Go extends DroidGap 
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init();
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
        //super.loadUrl("file:///android_asset/www/index.html")
    }
}
