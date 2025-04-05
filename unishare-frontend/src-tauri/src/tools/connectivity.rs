// -----------------------
// BLUETOOTH CHECK
// -----------------------

#[cfg(target_os = "windows")]
pub fn check_bluetooth() -> Option<bool> {
    use std::process::Command;
    let output = Command::new("powershell")
        .arg("-Command")
        .arg("Get-PnpDevice -Class Bluetooth | Where-Object { $_.Status -eq 'OK' }")
        .output()
        .ok()?;

    Some(!output.stdout.is_empty())
}

#[cfg(target_os = "macos")]
pub fn check_bluetooth() -> Option<bool> {
    use std::process::Command;
    let output = Command::new("system_profiler")
        .arg("SPBluetoothDataType")
        .output()
        .ok()?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    Some(stdout.contains("Bluetooth Power: On"))
}

#[cfg(target_os = "linux")]
pub fn check_bluetooth() -> Option<bool> {
    use std::process::Command;
    let output = Command::new("rfkill")
        .arg("list")
        .output()
        .ok()?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    Some(stdout.contains("Bluetooth") && !stdout.contains("Soft blocked: yes"))
}

// -----------------------
// WIFI DIRECT CHECK (Mocked)
// -----------------------

pub fn check_wifi_direct() -> Option<bool> {
    // Wi-Fi Direct is not commonly supported on desktop OSes.
    // You can optionally return `false` or use platform-specific tools.
    Some(false) // Placeholder
}

// -----------------------
// INTERNET CHECK
// -----------------------

pub fn check_internet() -> Option<bool> {
    use std::time::Duration;
    let client = reqwest::blocking::Client::builder()
        .timeout(Duration::from_secs(3))
        .build()
        .ok()?;

    let response = client.get("https://www.google.com").send();
    Some(response.is_ok())
}
