package com.joron.app

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore

class MainActivity : AppCompatActivity() {
    private lateinit var auth: FirebaseAuth
    private val db by lazy { FirebaseFirestore.getInstance() }

    private lateinit var nameInput: EditText
    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var registerButton: Button
    private lateinit var loginButton: Button
    private lateinit var resetButton: Button
    private lateinit var saveBiodataButton: Button
    private lateinit var biodataAgeInput: EditText
    private lateinit var biodataDistrictInput: EditText
    private lateinit var biodataOccupationInput: EditText
    private lateinit var biodataEducationInput: EditText
    private lateinit var progressBar: ProgressBar
    private lateinit var statusText: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        FirebaseApp.initializeApp(this)
        setContentView(R.layout.activity_main)

        auth = FirebaseAuth.getInstance()
        nameInput = findViewById(R.id.nameInput)
        emailInput = findViewById(R.id.emailInput)
        passwordInput = findViewById(R.id.passwordInput)
        registerButton = findViewById(R.id.registerButton)
        loginButton = findViewById(R.id.loginButton)
        resetButton = findViewById(R.id.resetButton)
        saveBiodataButton = findViewById(R.id.saveBiodataButton)
        biodataAgeInput = findViewById(R.id.biodataAgeInput)
        biodataDistrictInput = findViewById(R.id.biodataDistrictInput)
        biodataOccupationInput = findViewById(R.id.biodataOccupationInput)
        biodataEducationInput = findViewById(R.id.biodataEducationInput)
        progressBar = findViewById(R.id.progressBar)
        statusText = findViewById(R.id.statusText)

        registerButton.setOnClickListener { register() }
        loginButton.setOnClickListener { login() }
        resetButton.setOnClickListener { resetPassword() }
        saveBiodataButton.setOnClickListener { saveOwnerBiodata() }

        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 1001)
        }

        auth.currentUser?.let {
            statusText.text = "Signed in as ${it.email}"
        }
    }

    private fun register() {
        val name = nameInput.text.toString().trim()
        val email = emailInput.text.toString().trim()
        val password = passwordInput.text.toString()

        if (name.isBlank()) return showStatus("Please enter your name.")
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) return showStatus("Please enter a valid email.")
        if (password.length < 6) return showStatus("Password must be at least 6 characters.")

        setLoading(true)
        auth.createUserWithEmailAndPassword(email, password)
            .addOnSuccessListener { result ->
                val uid = result.user?.uid ?: return@addOnSuccessListener setLoading(false)
                val profile = mapOf(
                    "uid" to uid,
                    "name" to name,
                    "email" to email,
                    "role" to "user",
                    "accountStatus" to "active",
                    "createdAt" to FieldValue.serverTimestamp()
                )
                db.collection("users").document(uid).set(profile)
                    .addOnSuccessListener { showStatus("Account created successfully.") }
                    .addOnFailureListener { e -> showStatus("Account created, but profile save failed: ${e.localizedMessage}") }
                    .addOnCompleteListener { setLoading(false) }
            }
            .addOnFailureListener { e ->
                setLoading(false)
                showStatus(e.localizedMessage ?: "Registration failed.")
            }
    }

    private fun login() {
        val email = emailInput.text.toString().trim()
        val password = passwordInput.text.toString()

        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) return showStatus("Please enter a valid email.")
        if (password.isBlank()) return showStatus("Please enter your password.")

        setLoading(true)
        auth.signInWithEmailAndPassword(email, password)
            .addOnSuccessListener { showStatus("Login successful.") }
            .addOnFailureListener { e -> showStatus(e.localizedMessage ?: "Login failed.") }
            .addOnCompleteListener { setLoading(false) }
    }

    private fun resetPassword() {
        val email = emailInput.text.toString().trim()
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) return showStatus("Enter your email first.")

        setLoading(true)
        auth.sendPasswordResetEmail(email)
            .addOnSuccessListener { showStatus("Password reset email sent.") }
            .addOnFailureListener { e -> showStatus(e.localizedMessage ?: "Could not send reset email.") }
            .addOnCompleteListener { setLoading(false) }
    }

    private fun saveOwnerBiodata() {
        val user = auth.currentUser ?: return showStatus("Please login first to save your biodata.")
        val name = nameInput.text.toString().trim()
        val age = biodataAgeInput.text.toString().trim()
        val district = biodataDistrictInput.text.toString().trim()
        val occupation = biodataOccupationInput.text.toString().trim()
        val education = biodataEducationInput.text.toString().trim()

        if (name.isBlank()) return showStatus("Enter your name first.")
        if (age.isBlank()) return showStatus("Enter your age.")
        if (district.isBlank()) return showStatus("Enter your district.")

        setLoading(true)
        val biodata = mapOf(
            "uid" to user.uid,
            "name" to name,
            "email" to (user.email ?: ""),
            "age" to age,
            "district" to district,
            "occupation" to occupation,
            "education" to education,
            "profileType" to "owner-matrimony",
            "isOwner" to true,
            "registrationFee" to 0,
            "accountStatus" to "active",
            "updatedAt" to FieldValue.serverTimestamp()
        )

        db.collection("biodata").document(user.uid).set(biodata)
            .addOnSuccessListener { showStatus("আপনার Owner Matrimony Biodata সফলভাবে সংরক্ষণ হয়েছে। Registration fee: 0 টাকা।") }
            .addOnFailureListener { e -> showStatus("Biodata save failed: ${e.localizedMessage}") }
            .addOnCompleteListener { setLoading(false) }
    }

    private fun setLoading(loading: Boolean) {
        progressBar.visibility = if (loading) View.VISIBLE else View.GONE
        registerButton.isEnabled = !loading
        loginButton.isEnabled = !loading
        resetButton.isEnabled = !loading
        saveBiodataButton.isEnabled = !loading
    }

    private fun showStatus(message: String) {
        statusText.text = message
    }
}
