package com.joron.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Stars
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

private val JoronGreen = Color(0xFF087A62)
private val JoronPink = Color(0xFFE91E63)
private val JoronPinkSoft = Color(0xFFFFE8F1)
private val JoronGreenSoft = Color(0xFFE8F8F2)
private val JoronPurple = Color(0xFF8E44AD)
private val JoronBlue = Color(0xFF2196F3)
private val JoronInk = Color(0xFF18302A)
private val JoronBg = Color(0xFFFFFBFD)

private const val LogoUrl = "https://raw.githubusercontent.com/muyeedsarker/JORON/main/assets/joron-logo.jpg"

private enum class Screen(val title: String) {
    Home("হোম"), Login("লগইন"), Register("রেজিস্ট্রেশন"), Dashboard("ড্যাশবোর্ড"),
    Biodata("স্মার্ট বায়োডাটা"), Preference("পার্টনার পছন্দ"), Matching("স্মার্ট ম্যাচ"),
    Profile("প্রোফাইল"), Interests("ইন্টারেস্ট"), Chat("চ্যাট"), Membership("মেম্বারশিপ"),
    Payment("পেমেন্ট"), Help("হেল্প সেন্টার"), Privacy("প্রাইভেসি ও সেফটি"), Report("রিপোর্ট"),
    Settings("সেটিংস")
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { JoronApp() }
    }
}

@Composable
private fun JoronApp() {
    var screen by remember { mutableStateOf(Screen.Home) }
    MaterialTheme {
        Surface(modifier = Modifier.fillMaxSize(), color = JoronBg) {
            Scaffold(
                containerColor = JoronBg,
                topBar = {
                    if (screen != Screen.Home) {
                        TopAppBar(
                            title = { Text(screen.title, fontWeight = FontWeight.Bold, color = JoronGreen) },
                            navigationIcon = {
                                IconButton(onClick = { screen = Screen.Home }) {
                                    Icon(Icons.Default.ArrowBack, "পেছনে")
                                }
                            },
                            colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
                        )
                    }
                },
                bottomBar = {
                    if (screen in setOf(Screen.Dashboard, Screen.Matching, Screen.Chat, Screen.Profile)) {
                        NavigationBar(containerColor = Color.White) {
                            BottomItem("হোম", Icons.Default.Home, screen == Screen.Dashboard) { screen = Screen.Dashboard }
                            BottomItem("ম্যাচ", Icons.Default.Favorite, screen == Screen.Matching) { screen = Screen.Matching }
                            BottomItem("চ্যাট", Icons.Default.Send, screen == Screen.Chat) { screen = Screen.Chat }
                            BottomItem("প্রোফাইল", Icons.Default.Person, screen == Screen.Profile) { screen = Screen.Profile }
                        }
                    }
                }
            ) { padding ->
                Box(Modifier.padding(padding)) {
                    when (screen) {
                        Screen.Home -> HomeScreen({ screen = it })
                        Screen.Login -> LoginScreen({ screen = it })
                        Screen.Register -> RegisterScreen({ screen = it })
                        Screen.Dashboard -> DashboardScreen({ screen = it })
                        Screen.Biodata -> BiodataScreen({ screen = it })
                        Screen.Preference -> PreferenceScreen({ screen = it })
                        Screen.Matching -> MatchingScreen({ screen = it })
                        Screen.Profile -> ProfileScreen({ screen = it })
                        Screen.Interests -> InterestsScreen({ screen = it })
                        Screen.Chat -> ChatScreen({ screen = it })
                        Screen.Membership -> MembershipScreen({ screen = it })
                        Screen.Payment -> PaymentScreen({ screen = it })
                        Screen.Help -> HelpScreen({ screen = it })
                        Screen.Privacy -> PrivacyScreen({ screen = it })
                        Screen.Report -> ReportScreen({ screen = it })
                        Screen.Settings -> SettingsScreen({ screen = it })
                    }
                }
            }
        }
    }
}

@Composable
private fun BottomItem(label: String, icon: androidx.compose.ui.graphics.vector.ImageVector, selected: Boolean, onClick: () -> Unit) {
    NavigationBarItem(selected = selected, onClick = onClick, icon = { Icon(icon, label) }, label = { Text(label, fontSize = 11.sp) })
}

@Composable
private fun BrandHeader() {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
        AsyncImage(
            model = LogoUrl,
            contentDescription = "JORON Logo",
            modifier = Modifier.size(104.dp).clip(CircleShape),
            contentScale = ContentScale.Crop
        )
        Spacer(Modifier.height(8.dp))
        Text("JORON", color = JoronGreen, fontSize = 34.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 2.sp)
        Text("দুজনের গল্প, এক জোড়ন। ❤️", color = JoronPink, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
    }
}

@Composable
private fun BrandHero() {
    Column(
        modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(28.dp)).background(
            Brush.linearGradient(listOf(Color(0xFFFFEFF5), Color.White, Color(0xFFE9FAF3)))
        ).padding(22.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("❤️ বিশ্বাস • সম্মান • সম্পর্ক", color = JoronGreen, fontWeight = FontWeight.Bold, fontSize = 16.sp,
            modifier = Modifier.background(JoronGreenSoft, RoundedCornerShape(50)).padding(horizontal = 18.dp, vertical = 10.dp))
        Spacer(Modifier.height(18.dp))
        Text("স্বাগতম JORON-এ", color = JoronPink, fontSize = 31.sp, fontWeight = FontWeight.ExtraBold, textAlign = TextAlign.Center)
        Text("সুন্দর সম্পর্কের বিশ্বস্ত ঠিকানা", color = JoronGreen, fontSize = 25.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
        Spacer(Modifier.height(12.dp))
        Text("শুধু বায়োডাটা নয়—আপনার জন্য উপযুক্ত মানুষ খুঁজুন।", color = JoronInk, fontSize = 16.sp, lineHeight = 25.sp, textAlign = TextAlign.Center)
    }
}

@Composable
private fun HomeScreen(go: (Screen) -> Unit) {
    LazyColumn(modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp), contentPadding = androidx.compose.foundation.layout.PaddingValues(vertical = 20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        item { BrandHeader() }
        item {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                ActionGridButton("🏠  হোম", JoronPink) { }
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                    ActionGridButton("🤝  আমাদের সম্পর্কে", JoronGreen, Modifier.weight(1f)) { go(Screen.Privacy) }
                    ActionGridButton("✨  বৈশিষ্ট্য", JoronPurple, Modifier.weight(1f)) { go(Screen.Help) }
                }
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                    ActionGridButton("💎  Membership", JoronBlue, Modifier.weight(1f)) { go(Screen.Membership) }
                    ActionGridButton("🔐  Login", JoronPink, Modifier.weight(1f)) { go(Screen.Login) }
                }
                ActionGridButton("❤️  এখনই যোগ দিন", JoronPink) { go(Screen.Register) }
            }
        }
        item { BrandHero() }
        item {
            FeatureCard("🔎 স্মার্ট ম্যাচিং", "আপনার পছন্দ, মূল্যবোধ ও জীবনযাত্রার ভিত্তিতে explainable match score।")
        }
        item {
            FeatureCard("🔐 Privacy-first", "ফোন, আয়, স্বাস্থ্য ও সুনির্দিষ্ট ঠিকানার মতো sensitive তথ্য default-এ সুরক্ষিত।")
        }
        item {
            FeatureCard("💬 নিরাপদ যোগাযোগ", "Interest, chat, block এবং report—সবকিছুর জন্য পরিষ্কার safety flow।")
        }
    }
}

@Composable
private fun ActionGridButton(text: String, color: Color, modifier: Modifier = Modifier.fillMaxWidth(), onClick: () -> Unit) {
    OutlinedButton(onClick = onClick, modifier = modifier.height(58.dp), shape = RoundedCornerShape(20.dp), border = androidx.compose.foundation.BorderStroke(2.dp, color)) {
        Text(text, color = color, fontWeight = FontWeight.Bold, fontSize = 15.sp, textAlign = TextAlign.Center)
    }
}

@Composable
private fun FeatureCard(title: String, body: String) {
    Card(shape = RoundedCornerShape(22.dp), colors = CardDefaults.cardColors(containerColor = Color.White), elevation = CardDefaults.cardElevation(2.dp)) {
        Column(Modifier.padding(18.dp)) {
            Text(title, color = JoronGreen, fontWeight = FontWeight.Bold, fontSize = 18.sp)
            Spacer(Modifier.height(7.dp))
            Text(body, color = Color(0xFF53615D), lineHeight = 22.sp)
        }
    }
}

@Composable
private fun LoginScreen(go: (Screen) -> Unit) {
    FormShell("স্বাগতম আবার", "আপনার JORON অ্যাকাউন্টে প্রবেশ করুন") {
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("ইমেইল / মোবাইল") }, singleLine = true)
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("পাসওয়ার্ড") }, singleLine = true)
        PrimaryButton("🔐 লগইন") { go(Screen.Dashboard) }
        TextButton(onClick = { go(Screen.Register) }) { Text("অ্যাকাউন্ট নেই? রেজিস্ট্রেশন করুন", color = JoronPink) }
        TextButton(onClick = { go(Screen.Help) }) { Text("পাসওয়ার্ড ভুলে গেছেন?", color = JoronGreen) }
    }
}

@Composable
private fun RegisterScreen(go: (Screen) -> Unit) {
    FormShell("JORON-এ যোগ দিন", "প্রথমে একটি নিরাপদ অ্যাকাউন্ট তৈরি করুন") {
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("পূর্ণ নাম") }, singleLine = true)
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("ইমেইল") }, singleLine = true)
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("মোবাইল") }, singleLine = true)
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("পাসওয়ার্ড") }, singleLine = true)
        PrimaryButton("❤️ অ্যাকাউন্ট তৈরি করুন") { go(Screen.Biodata) }
        PrivacyPill("🔒 পাসওয়ার্ড Firestore-এ রাখা হবে না। Firebase Authentication ব্যবহার করুন।")
    }
}

@Composable
private fun FormShell(title: String, subtitle: String, content: @Composable ColumnScope.() -> Unit) {
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(13.dp)) {
        BrandHeader()
        Spacer(Modifier.height(5.dp))
        Text(title, color = JoronGreen, fontSize = 26.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
        Text(subtitle, color = Color.Gray, textAlign = TextAlign.Center)
        Spacer(Modifier.height(4.dp))
        content()
    }
}

@Composable
private fun PrimaryButton(text: String, onClick: () -> Unit) {
    Button(onClick = onClick, modifier = Modifier.fillMaxWidth().height(54.dp), shape = RoundedCornerShape(28.dp), colors = ButtonDefaults.buttonColors(containerColor = JoronPink)) {
        Text(text, color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
private fun DashboardScreen(go: (Screen) -> Unit) {
    LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(14.dp), contentPadding = androidx.compose.foundation.layout.PaddingValues(bottom = 20.dp)) {
        item { Text("আসসালামু আলাইকুম 👋", color = JoronGreen, fontSize = 25.sp, fontWeight = FontWeight.Bold) }
        item { Text("আপনার জন্য আজকের সম্পর্কের যাত্রা", color = Color.Gray) }
        item { ScoreCard() }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                MiniCard("📝", "বায়োডাটা", Modifier.weight(1f)) { go(Screen.Biodata) }
                MiniCard("❤️", "পছন্দ", Modifier.weight(1f)) { go(Screen.Preference) }
                MiniCard("🔎", "ম্যাচ", Modifier.weight(1f)) { go(Screen.Matching) }
            }
        }
        item { SectionTitle("আপনার জন্য প্রস্তাবিত") }
        items(listOf("সাদিয়া • ঢাকা", "রাফি • চট্টগ্রাম", "মেহজাবিন • রাজশাহী")) { name -> MatchListCard(name, go) }
    }
}

@Composable
private fun ScoreCard() {
    Card(shape = RoundedCornerShape(24.dp), colors = CardDefaults.cardColors(containerColor = JoronGreenSoft)) {
        Column(Modifier.padding(18.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                Column { Text("Match-readiness", color = JoronGreen, fontWeight = FontWeight.Bold); Text("আপনার প্রোফাইল ৭৮% প্রস্তুত", color = Color.DarkGray) }
                Text("78%", color = JoronPink, fontSize = 28.sp, fontWeight = FontWeight.ExtraBold)
            }
            Spacer(Modifier.height(12.dp))
            LinearProgressIndicator(progress = { 0.78f }, modifier = Modifier.fillMaxWidth(), color = JoronPink, trackColor = Color.White)
        }
    }
}

@Composable
private fun MiniCard(icon: String, label: String, modifier: Modifier, onClick: () -> Unit) {
    Card(modifier = modifier.clickable(onClick = onClick), shape = RoundedCornerShape(18.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
        Column(Modifier.padding(vertical = 15.dp), horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
            Text(icon, fontSize = 23.sp); Spacer(Modifier.height(5.dp)); Text(label, color = JoronGreen, fontWeight = FontWeight.Bold, fontSize = 12.sp)
        }
    }
}

@Composable
private fun BiodataScreen(go: (Screen) -> Unit) {
    FormShell("আপনার Smart Biodata", "ধাপে ধাপে তথ্য দিন; sensitive তথ্যের visibility আপনি নিয়ন্ত্রণ করবেন") {
        SectionTitle("১. ব্যক্তিগত তথ্য")
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("পূর্ণ নাম") })
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("বয়স") })
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("উচ্চতা") })
        SectionTitle("২. ঠিকানা")
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("বিভাগ") })
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("জেলা") })
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("উপজেলা / থানা") })
        SectionTitle("৩. শিক্ষা ও পেশা")
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("সর্বোচ্চ শিক্ষা") })
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("পেশা") })
        SectionTitle("৪. পরিবার ও জীবনধারা")
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("পরিবার সম্পর্কে") }, minLines = 3)
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("নিজের সম্পর্কে") }, minLines = 4)
        PrivacyPill("🔒 ফোন, ইমেইল, exact address, income, health ও child information default-এ protected থাকবে।")
        PrimaryButton("পরের ধাপ: Partner Preference →") { go(Screen.Preference) }
    }
}

@Composable
private fun PreferenceScreen(go: (Screen) -> Unit) {
    FormShell("আপনার জীবনসঙ্গীর পছন্দ", "Match score যেন আপনার প্রকৃত compatibility প্রতিফলিত করে") {
        PreferenceField("বয়সের পরিসর", "২৫–৩২")
        PreferenceField("উচ্চতা", "৫'০\" – ৫'৮\"")
        PreferenceField("জেলা / বসবাস", "ঢাকা / যেকোনো")
        PreferenceField("শিক্ষা", "স্নাতক বা সমমান")
        PreferenceField("পেশা", "প্রফেশনাল / ব্যবসা")
        PreferenceField("মূল্যবোধ", "পরিবার, সম্মান, দায়িত্ব")
        SectionTitle("Top-3 priorities")
        PrivacyPill("১. চরিত্র ও মূল্যবোধ   ২. পরিবার   ৩. ভবিষ্যৎ পরিকল্পনা")
        PrimaryButton("❤️ পছন্দ সংরক্ষণ করুন") { go(Screen.Matching) }
    }
}

@Composable
private fun PreferenceField(label: String, value: String) {
    Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
        Row(Modifier.fillMaxWidth().padding(15.dp), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(label, color = Color.Gray); Text(value, color = JoronGreen, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun MatchingScreen(go: (Screen) -> Unit) {
    LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(13.dp)) {
        item { SearchBar() }
        item { Text("আপনার জন্য সম্ভাব্য ১২টি match", color = JoronGreen, fontSize = 21.sp, fontWeight = FontWeight.Bold) }
        items(listOf("সাদিয়া • ঢাকা • 92%", "রাফি • চট্টগ্রাম • 87%", "মেহজাবিন • রাজশাহী • 84%", "তানভীর • সিলেট • 81%")) { item -> MatchListCard(item, go) }
        item { PrivacyPill("💡 Match score payment-এর উপর নির্ভর করে না। কারণগুলো দেখুন এবং নিজের সিদ্ধান্ত নিন।") }
    }
}

@Composable
private fun SearchBar() {
    OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), leadingIcon = { Icon(Icons.Default.Search, null) }, label = { Text("জেলা, পেশা, শিক্ষা দিয়ে খুঁজুন") }, singleLine = true)
}

@Composable
private fun MatchListCard(name: String, go: (Screen) -> Unit) {
    Card(shape = RoundedCornerShape(22.dp), colors = CardDefaults.cardColors(containerColor = Color.White), modifier = Modifier.clickable { go(Screen.Profile) }) {
        Row(Modifier.fillMaxWidth().padding(15.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(68.dp).clip(CircleShape).background(JoronPinkSoft), contentAlignment = Alignment.Center) { Text("❤️", fontSize = 28.sp) }
            Spacer(Modifier.width(13.dp))
            Column(Modifier.weight(1f)) {
                Text(name, color = JoronInk, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Text("শিক্ষা • পেশা • মূল্যবোধে ভালো মিল", color = Color.Gray, fontSize = 13.sp)
                Spacer(Modifier.height(6.dp))
                Text("৯টি কারণ দেখুন →", color = JoronGreen, fontWeight = FontWeight.SemiBold, fontSize = 12.sp)
            }
            Icon(Icons.Default.FavoriteBorder, null, tint = JoronPink)
        }
    }
}

@Composable
private fun ProfileScreen(go: (Screen) -> Unit) {
    LazyColumn(Modifier.fillMaxSize(), verticalArrangement = Arrangement.spacedBy(14.dp), contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp)) {
        item {
            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                Box(Modifier.size(120.dp).clip(CircleShape).background(JoronGreenSoft), contentAlignment = Alignment.Center) { Text("👤", fontSize = 58.sp) }
                Spacer(Modifier.height(10.dp)); Text("সাদিয়া রহমান", color = JoronGreen, fontSize = 25.sp, fontWeight = FontWeight.Bold)
                Text("ঢাকা • ২৮ • ৫'৪\"", color = Color.Gray)
                Spacer(Modifier.height(8.dp)); PrivacyPill("✓ Verified profile • visibility controlled")
            }
        }
        item { SectionTitle("Match score 92%") }
        item { FeatureCard("💚 কেন ভালো মিল", "বয়স, শিক্ষা, জেলা, পরিবার ও জীবনধারায় শক্তিশালী compatibility পাওয়া গেছে।") }
        item { FeatureCard("🔐 যা আপনার কাছে সীমিত", "ফোন, exact address ও sensitive information অনুমতি ছাড়া দেখা যাবে না।") }
        item { PrimaryButton("❤️ Interest পাঠান") { go(Screen.Interests) } }
        item { OutlinedButton(onClick = { go(Screen.Report) }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(28.dp)) { Text("🚨 Report / Block", color = JoronPink) } }
    }
}

@Composable
private fun InterestsScreen(go: (Screen) -> Unit) {
    FormShell("আপনার Interest", "সম্মানজনকভাবে যোগাযোগ শুরু করুন") {
        PrivacyPill("❤️ আপনি এই profile-এ interest পাঠাতে পারেন। অপর পক্ষ গ্রহণ করলে chat শুরু হবে।")
        PrimaryButton("Interest পাঠান") { go(Screen.Chat) }
        SectionTitle("আপনার পাঠানো")
        FeatureCard("সাদিয়া • ঢাকা", "Interest sent • অপেক্ষমাণ")
        SectionTitle("আপনার পাওয়া")
        FeatureCard("রাফি • চট্টগ্রাম", "আপনার profile পছন্দ করেছেন")
    }
}

@Composable
private fun ChatScreen(go: (Screen) -> Unit) {
    var message by remember { mutableStateOf("") }
    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(50.dp).clip(CircleShape).background(JoronPinkSoft), contentAlignment = Alignment.Center) { Text("❤️") }
            Spacer(Modifier.width(10.dp)); Column { Text("সাদিয়া রহমান", color = JoronGreen, fontWeight = FontWeight.Bold); Text("সুরক্ষিত যোগাযোগ", color = Color.Gray, fontSize = 12.sp) }
        }
        Spacer(Modifier.height(12.dp))
        Column(Modifier.weight(1f).fillMaxWidth(), verticalArrangement = Arrangement.Bottom) {
            ChatBubble("আসসালামু আলাইকুম। আপনার profile-এর মূল্যবোধের অংশটি ভালো লেগেছে।", false)
            ChatBubble("ওয়ালাইকুম আসসালাম। ধন্যবাদ। আপনিও আপনার পছন্দ সম্পর্কে বলতে পারেন।", true)
        }
        Row(verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(value = message, onValueChange = { message = it }, modifier = Modifier.weight(1f), placeholder = { Text("মেসেজ লিখুন…") }, singleLine = true)
            IconButton(onClick = { message = "" }) { Icon(Icons.Default.Send, "পাঠান", tint = JoronPink) }
        }
        TextButton(onClick = { go(Screen.Report) }) { Text("🚨 Block / Report", color = JoronPink) }
    }
}

@Composable
private fun ChatBubble(text: String, mine: Boolean) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = if (mine) Arrangement.End else Arrangement.Start) {
        Text(text, modifier = Modifier.background(if (mine) JoronGreenSoft else Color.White, RoundedCornerShape(18.dp)).padding(13.dp), color = JoronInk, lineHeight = 21.sp)
    }
    Spacer(Modifier.height(8.dp))
}

@Composable
private fun MembershipScreen(go: (Screen) -> Unit) {
    LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        item { Text("💎 JORON Membership", color = JoronGreen, fontSize = 27.sp, fontWeight = FontWeight.ExtraBold) }
        item { Text("Premium সুবিধা visibility ও communication-এর কিছু সীমা সহজ করে; match score বাড়ায় না।", color = Color.Gray, lineHeight = 22.sp) }
        item { PlanCard("Basic", "৳ ১৯৯ / মাস", listOf("অতিরিক্ত profile view", "Interest management"), JoronBlue) { go(Screen.Payment) } }
        item { PlanCard("Premium", "৳ ৪৯৯ / মাস", listOf("Priority discovery", "Advanced filters", "Enhanced chat controls"), JoronPink) { go(Screen.Payment) } }
        item { PrivacyPill("🔐 Payment verification server-side হবে। সফল payment ছাড়া membership active দেখাবেন না।") }
    }
}

@Composable
private fun PlanCard(name: String, price: String, features: List<String>, color: Color, onClick: () -> Unit) {
    Card(shape = RoundedCornerShape(24.dp), colors = CardDefaults.cardColors(containerColor = Color.White), modifier = Modifier.border(2.dp, color, RoundedCornerShape(24.dp))) {
        Column(Modifier.padding(18.dp)) {
            Text(name, color = color, fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Text(price, color = JoronInk, fontSize = 28.sp, fontWeight = FontWeight.ExtraBold)
            features.forEach { Text("✓ $it", color = Color.DarkGray, modifier = Modifier.padding(top = 7.dp)) }
            Spacer(Modifier.height(10.dp)); PrimaryButton("নির্বাচন করুন", onClick)
        }
    }
}

@Composable
private fun PaymentScreen(go: (Screen) -> Unit) {
    FormShell("Membership Payment", "আপনার পছন্দের payment method নির্বাচন করুন") {
        PaymentMethod("📱 bKash", "Mobile payment")
        PaymentMethod("💳 Card", "Visa / Mastercard")
        PaymentMethod("🏦 Bank", "Manual / gateway")
        PrimaryButton("নিরাপদভাবে পেমেন্টে যান") { go(Screen.Membership) }
        PrivacyPill("🔒 Transaction status শুধুমাত্র verified gateway response থেকে নেওয়া হবে।")
    }
}

@Composable
private fun PaymentMethod(title: String, subtitle: String) {
    Card(shape = RoundedCornerShape(18.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
        Row(Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Text(title, color = JoronGreen, fontWeight = FontWeight.Bold, fontSize = 17.sp); Spacer(Modifier.weight(1f)); Text(subtitle, color = Color.Gray, fontSize = 12.sp)
        }
    }
}

@Composable
private fun HelpScreen(go: (Screen) -> Unit) {
    LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item { Text("🤖 Help Center", color = JoronGreen, fontSize = 27.sp, fontWeight = FontWeight.ExtraBold) }
        item { SearchBar() }
        items(listOf("কীভাবে Smart Biodata পূরণ করব?", "Match score কীভাবে তৈরি হয়?", "Privacy visibility কীভাবে বদলাব?", "কীভাবে কাউকে report/block করব?", "Membership payment যাচাই হতে কত সময় লাগে?")) { q -> FeatureCard("❓ $q", "এই প্রশ্নের উত্তর ও নিরাপদ ব্যবহার নির্দেশনা এখানে দেখানো হবে।") }
        item { PrimaryButton("Privacy & Safety দেখুন") { go(Screen.Privacy) } }
    }
}

@Composable
private fun PrivacyScreen(go: (Screen) -> Unit) {
    LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item { Text("🔐 Privacy & Safety", color = JoronGreen, fontSize = 27.sp, fontWeight = FontWeight.ExtraBold) }
        item { FeatureCard("ডিফল্ট সুরক্ষা", "Phone, email, exact address, income, health ও child information sensitive হিসেবে ধরা হবে।") }
        item { FeatureCard("Child privacy", "শিশুর নাম, ছবি, স্কুল, ফোন বা exact identifying information matrimonial profile-এ সংগ্রহ করা হবে না।") }
        item { FeatureCard("Visibility levels", "Public • Logged-in users • Approved persons • Only me") }
        item { FeatureCard("Verification", "Verification badge শুধুমাত্র বাস্তব verification সম্পন্ন হলে দেখানো হবে।") }
        item { PrimaryButton("🚨 Report a concern") { go(Screen.Report) } }
    }
}

@Composable
private fun ReportScreen(go: (Screen) -> Unit) {
    FormShell("Report / Safety", "আপনার নিরাপত্তা ও সম্মান JORON-এর অগ্রাধিকার") {
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("কেন report করছেন?") }, minLines = 4)
        OutlinedTextField(value = "", onValueChange = {}, modifier = Modifier.fillMaxWidth(), label = { Text("অতিরিক্ত তথ্য (ঐচ্ছিক)") }, minLines = 4)
        PrimaryButton("🚨 Report জমা দিন") { go(Screen.Home) }
        PrivacyPill("আপনার report moderation workflow-এ যাবে। জরুরি পরিস্থিতিতে স্থানীয় emergency service ব্যবহার করুন।")
    }
}

@Composable
private fun SettingsScreen(go: (Screen) -> Unit) {
    LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item { Text("⚙️ Settings", color = JoronGreen, fontSize = 27.sp, fontWeight = FontWeight.ExtraBold) }
        item { SettingRow("👤 Profile & Biodata", Screen.Biodata, go) }
        item { SettingRow("❤️ Partner Preference", Screen.Preference, go) }
        item { SettingRow("🔐 Privacy controls", Screen.Privacy, go) }
        item { SettingRow("💎 Membership", Screen.Membership, go) }
        item { SettingRow("🤖 Help Center", Screen.Help, go) }
    }
}

@Composable
private fun SettingRow(label: String, target: Screen, go: (Screen) -> Unit) {
    Card(modifier = Modifier.fillMaxWidth().clickable { go(target) }, shape = RoundedCornerShape(18.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
        Row(Modifier.padding(17.dp), verticalAlignment = Alignment.CenterVertically) { Icon(Icons.Default.Settings, null, tint = JoronGreen); Spacer(Modifier.width(12.dp)); Text(label, color = JoronInk, fontWeight = FontWeight.SemiBold) }
    }
}

@Composable
private fun SectionTitle(text: String) {
    Text(text, color = JoronGreen, fontSize = 18.sp, fontWeight = FontWeight.Bold, modifier = Modifier.fillMaxWidth().padding(top = 3.dp))
}

@Composable
private fun PrivacyPill(text: String) {
    Row(Modifier.fillMaxWidth().background(JoronGreenSoft, RoundedCornerShape(18.dp)).padding(13.dp), verticalAlignment = Alignment.CenterVertically) {
        Icon(Icons.Default.Shield, null, tint = JoronGreen, modifier = Modifier.size(20.dp)); Spacer(Modifier.width(8.dp)); Text(text, color = JoronGreen, fontSize = 13.sp, lineHeight = 19.sp)
    }
}
