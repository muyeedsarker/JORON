package com.joron.app

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
        progressBar = findViewById(R.id.progressBar)
        statusText = findViewById(R.id.statusText)

        registerButton.setOnClickListener { register() }
        loginButton.setOnClickListener { login() }

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

    private fun setLoading(loading: Boolean) {
        progressBar.visibility = if (loading) View.VISIBLE else View.GONE
        registerButton.isEnabled = !loading
        loginButton.isEnabled = !loading
    }

    private fun showStatus(message: String) {
        statusText.text = message
    }
}
