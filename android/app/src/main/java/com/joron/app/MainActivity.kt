package com.joron.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.FirebaseApp

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize Firebase using android/app/google-services.json.
        FirebaseApp.initializeApp(this)

        setContentView(R.layout.activity_main)
    }
}
