package com.example.watercalc

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.roundToInt

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    WaterCalculatorScreen()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WaterCalculatorScreen() {
    var minTemp by remember { mutableStateOf("15") }
    var maxTemp by remember { mutableStateOf("60") }
    var volume by remember { mutableStateOf("50") }
    var power by remember { mutableStateOf("2") }
    var price by remember { mutableStateOf("5.5") }

    val results = remember(minTemp, maxTemp, volume, power, price) {
        calculateResults(minTemp, maxTemp, volume, power, price)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Калькулятор нагрева воды",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF2E7D32) // Dark Green
        )

        OutlinedTextField(
            value = minTemp,
            onValueChange = { minTemp = it },
            label = { Text("Начальная температура (°C)") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            modifier = Modifier.fillMaxWidth()
        )

        OutlinedTextField(
            value = maxTemp,
            onValueChange = { maxTemp = it },
            label = { Text("Целевая температура (°C)") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            modifier = Modifier.fillMaxWidth()
        )

        OutlinedTextField(
            value = volume,
            onValueChange = { volume = it },
            label = { Text("Объем воды (литры)") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            modifier = Modifier.fillMaxWidth()
        )

        OutlinedTextField(
            value = power,
            onValueChange = { power = it },
            label = { Text("Мощность ТЭНа (кВт)") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            modifier = Modifier.fillMaxWidth()
        )

        OutlinedTextField(
            value = price,
            onValueChange = { price = it },
            label = { Text("Цена за 1 кВт⋅ч (₽)") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            modifier = Modifier.fillMaxWidth()
        )

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(text = "Результаты", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Spacer(modifier = Modifier.height(8.dp))
                Text(text = "Итоговая стоимость: ${results.cost} ₽", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Text(text = "Энергия: ${results.energy} кВт⋅ч")
                Text(text = "Время нагрева: ${results.time}")
            }
        }
    }
}

data class CalcResult(val energy: String, val cost: String, val time: String)

fun calculateResults(minT: String, maxT: String, vol: String, pwr: String, prc: String): CalcResult {
    val t1 = minT.toDoubleOrNull() ?: 0.0
    val t2 = maxT.toDoubleOrNull() ?: 0.0
    val v = vol.toDoubleOrNull() ?: 0.0
    val p = pwr.toDoubleOrNull() ?: 0.0
    val pr = prc.toDoubleOrNull() ?: 0.0

    val deltaT = (t2 - t1).coerceAtLeast(0.0)
    val energyJoules = v * 4186 * deltaT
    val energyKWh = energyJoules / 3600000.0
    val timeHours = if (p > 0) energyKWh / p else 0.0
    val cost = energyKWh * pr

    val timeStr = if (timeHours >= 1.0) {
        String.format("%.1f ч", timeHours)
    } else {
        "${(timeHours * 60).roundToInt()} мин"
    }

    return CalcResult(
        energy = String.format("%.2f", energyKWh),
        cost = String.format("%.2f", cost),
        time = timeStr
    )
}
