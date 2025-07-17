
# Google Drive Transfer Tool with rclone

A simple, user-friendly Google Colab notebook that provides a graphical interface for transferring files between Google Drive remotes using rclone. Perfect for migrating data between Google accounts, organizing files across drives, or backing up important data.

## ✨ Features

- **🚀 Server-Side Transfer**: Leverages rclone's server-side copy to move data directly between Google Drive accounts, reducing bandwidth and increasing speed
- **🌐 Google Colab Integration**: No installation necessary on your local system. Run the tool entirely in your browser via Colab
- **📱 Simple GUI**: Interactive widgets make it easy for non-technical users to configure and run transfers
- **⚡ Fast & Efficient**: Direct transfers between Google Drive accounts without downloading to intermediate storage
- **🛡️ Safe**: No data is downloaded to Colab; transfers happen within Google's infrastructure
- **🔧 Flexible Configuration**: Support for various rclone options and performance tuning
- **📊 Real-time Monitoring**: Live progress updates and transfer statistics

## 🚀 Getting Started

### Option 1: Open in Google Colab (Recommended)
1. Click this link to open the notebook directly in Google Colab: 
   [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/dzp5103/gdrive-tranfer/blob/main/rclone_gdrive_transfer.ipynb)

2. Follow the step-by-step instructions in the notebook

### Option 2: Manual Setup
1. Download the `rclone_gdrive_transfer.ipynb` file
2. Upload it to your Google Drive
3. Open it with Google Colab
4. Follow the instructions in the notebook

## 📋 Prerequisites

You'll need an `rclone.conf` file with your Google Drive configurations. If you don't have one, see the guide below.

## 🔧 Creating an rclone.conf File

If you don't have an rclone configuration file yet, here's how to create one:

### Step 1: Install rclone locally
- **Windows**: Download from [rclone.org](https://rclone.org/downloads/) or use `winget install Rclone.Rclone`
- **macOS**: Use Homebrew: `brew install rclone`
- **Linux**: `curl https://rclone.org/install.sh | sudo bash`

### Step 2: Configure your Google Drive remotes
1. Run `rclone config` in your terminal
2. Choose "n" for new remote
3. Give it a name (e.g., "source_drive" or "backup_drive")
4. Choose "drive" for Google Drive
5. Follow the authentication process
6. Repeat for additional Google Drive accounts

### Step 3: Locate your config file
- **Linux/macOS**: `~/.config/rclone/rclone.conf`
- **Windows**: `%APPDATA%\rclone\rclone.conf`

### Step 4: Upload to the notebook
Use the file upload widget in Step 1 of the notebook to upload your `rclone.conf` file.

## 📖 How to Use

1. **Setup**: Run the first cell to install rclone and required packages
2. **Upload Config**: Use the file upload widget to upload your `rclone.conf` file
3. **Configure Transfer**: 
   - Enter source path (e.g., `source_drive:Documents/`)
   - Enter destination path (e.g., `backup_drive:Backup/Documents/`)
   - Choose transfer mode (Server-Side recommended)
   - Configure rclone options as needed
4. **Start Transfer**: Click the "Start Transfer" button and monitor progress

## ⚙️ Transfer Modes

### Server-Side Transfer (Recommended) ⚡
- Files are copied directly between Google Drive accounts using Google's servers
- Much faster than local transfers
- Doesn't use Colab's bandwidth or storage
- Best for Google Drive to Google Drive transfers

### Local Colab Transfer 🐌
- Files are downloaded to Colab VM then uploaded to destination
- Slower and uses Colab resources
- Use only if server-side transfer doesn't work

## 🛠️ Advanced Options

- **--dry-run**: Test transfers without actually copying files
- **--fast-list**: Use less memory for directory listings
- **--verbose**: Show detailed logging
- **Transfers**: Number of parallel file transfers (1-32)
- **Checkers**: Number of parallel checkers (1-64)

## 🆘 Troubleshooting

### Common Issues:
- **"No remotes found"**: Check your rclone.conf file format
- **"Authentication failed"**: Your tokens may have expired, reconfigure the remote
- **"Transfer failed"**: Verify remote names match those in your config file
- **Slow transfers**: Try adjusting the number of transfers and checkers

### Tips:
- Use `--dry-run` first to test your configuration
- For large transfers, consider breaking them into smaller chunks
- Server-side transfers work best between Google Drive remotes
- Check the real-time logs for detailed error information

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter issues or have questions:
1. Check the troubleshooting section above
2. Review the [rclone documentation](https://rclone.org/drive/)
3. Open an issue on this repository

---

*Made with ❤️ for easy Google Drive transfers*
