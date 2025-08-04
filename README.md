
# Google Drive Transfer Tool with rclone - Enhanced Edition

A comprehensive, user-friendly Google Colab notebook that provides an advanced graphical interface for transferring files between Google Drive remotes using rclone. Perfect for migrating data between Google accounts, organizing files across drives, or backing up important data with robust configuration management.

## ✨ Enhanced Features

### 🆕 **New in This Version**
- **🔧 Integrated Configuration Management**: Create rclone configurations directly in the notebook
- **📋 Smart Remote Selection**: Dropdown menus populated with available remotes
- **📁 Directory Browser**: Explore and browse remote directories before transferring
- **✅ Real-time Validation**: Immediate feedback on configuration errors and warnings
- **🎯 Command Preview**: See exactly what rclone command will be executed
- **🔄 Advanced Transfer Options**: Including update existing files, enhanced logging, and more

### 🚀 **Core Features**
- **⚡ Server-Side Transfer**: Leverages rclone's server-side copy to move data directly between Google Drive accounts, reducing bandwidth and increasing speed
- **🌐 Google Colab Integration**: No installation necessary on your local system. Run the tool entirely in your browser via Colab
- **📱 Intuitive GUI**: Advanced interactive widgets make it easy for non-technical users to configure and run transfers
- **🛡️ Safe**: No data is downloaded to Colab; transfers happen within Google's infrastructure
- **🔧 Flexible Configuration**: Support for various rclone options and performance tuning
- **📊 Real-time Monitoring**: Live progress updates and transfer statistics
- **🧪 Testing Mode**: Dry-run capability to test transfers without moving files

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

### Option A: Upload Existing Configuration
You'll need an `rclone.conf` file with your Google Drive configurations. If you don't have one, see the guide below.

### Option B: Create Configuration in Notebook (New!)
You can now create rclone configurations directly in the notebook! No local installation required.

## 🔧 Configuration Options

### Method 1: Create Configuration in Notebook (Recommended for New Users)

The enhanced notebook now includes a built-in configuration manager:

1. **Select "Create new rclone configuration"** in Step 1
2. **Choose authentication method:**
   - **Built-in OAuth**: Uses rclone's default credentials (simpler)
   - **Custom Client ID/Secret**: Uses your own Google API project (higher limits)
3. **Add remotes**: Enter descriptive names for your Google Drive accounts
4. **Authenticate**: Follow the OAuth flow to grant access
5. **Repeat**: Add multiple Google Drive accounts as needed

### Method 2: Upload Existing rclone.conf File

If you already have rclone configured locally:

#### Creating rclone.conf Locally

**Step 1: Install rclone locally**
- **Windows**: Download from [rclone.org](https://rclone.org/downloads/) or use `winget install Rclone.Rclone`
- **macOS**: Use Homebrew: `brew install rclone`
- **Linux**: `curl https://rclone.org/install.sh | sudo bash`

**Step 2: Configure your Google Drive remotes**
1. Run `rclone config` in your terminal
2. Choose "n" for new remote
3. Give it a name (e.g., "source_drive" or "backup_drive")
4. Choose "drive" for Google Drive
5. Follow the authentication process
6. Repeat for additional Google Drive accounts

**Step 3: Locate your config file**
- **Linux/macOS**: `~/.config/rclone/rclone.conf`
- **Windows**: `%APPDATA%\rclone\rclone.conf`

**Step 4: Upload to the notebook**
Use the file upload widget in Step 1 of the notebook to upload your `rclone.conf` file.

## 📖 Enhanced Usage Guide

### Step 1: Configuration Setup
- **Choose your method**: Upload existing config or create new configuration
- **For new configurations**: Add multiple Google Drive remotes with descriptive names
- **Authentication**: Follow OAuth flows to grant access to your Google Drive accounts

### Step 2: Advanced Transfer Configuration
- **Smart remote selection**: Choose from dropdown menus of available remotes
- **Directory browsing**: Explore source and destination directories before transferring
- **Path validation**: Real-time feedback on path correctness
- **Transfer modes**: 
  - **Server-Side** (Recommended): Direct Google-to-Google transfers
  - **Local Colab**: Routes through Colab VM when needed
- **Advanced options**:
  - **🧪 Dry Run**: Test without actually transferring files
  - **🔄 Update Existing**: Overwrite changed files
  - **⚡ Fast List**: Memory optimization for large directories
  - **📝 Verbose Logging**: Detailed transfer information
  - **Performance tuning**: Configurable parallel transfers and checkers

### Step 3: Enhanced Execution & Monitoring
- **Configuration validation**: Check settings before starting
- **Command preview**: See exactly what rclone command will run
- **Real-time monitoring**: Live progress updates and transfer statistics
- **Enhanced controls**: Start, stop, and validate with improved feedback

## ⚙️ Transfer Modes

### Server-Side Transfer (Recommended) ⚡
- Files are copied directly between Google Drive accounts using Google's servers
- Much faster than local transfers
- Doesn't use Colab's bandwidth or storage
- Best for Google Drive to Google Drive transfers
- Uses `--drive-server-side-across-configs=true`

### Local Colab Transfer 🐌
- Files are downloaded to Colab VM then uploaded to destination
- Slower and uses Colab resources
- Use only if server-side transfer doesn't work
- Useful for transfers between different cloud providers

## 🔐 Authentication Methods

### Built-in OAuth (Recommended)
- Uses rclone's default Google API credentials
- Simpler setup, no Google API project required
- Subject to Google's shared rate limits
- Perfect for most users

### Custom Client ID/Secret
- Uses your own Google API project credentials
- Higher API rate limits
- Better for heavy usage or large transfers
- Requires setting up Google API project

## 🛠️ Advanced Options

### Transfer Options
- **🧪 Dry Run**: Test transfers without copying files - perfect for validation
- **⚡ Fast List**: Use less memory for directory listings (recommended)
- **📝 Verbose**: Show detailed logging for troubleshooting
- **🔄 Update Existing**: Overwrite files in destination if different

### Performance Settings
- **Parallel Transfers**: Number of files to transfer simultaneously (1-32)
- **Parallel Checkers**: Number of parallel checkers for file comparison (1-64)
- **Progress Reporting**: Real-time stats and transfer monitoring

## 🆘 Enhanced Troubleshooting

### Common Issues & Solutions:
- **"No remotes found"**: Complete Step 1 configuration first
- **"Configuration validation failed"**: Check the validation messages in Step 3
- **"Authentication failed"**: Tokens may have expired, try recreating the remote
- **"Transfer failed"**: Verify remote names and paths using the directory browser
- **"Rate limit exceeded"**: Reduce parallel transfers or use custom API credentials

### Best Practices:
- **Always validate** configuration before starting large transfers
- **Test with dry run** first, especially for important data
- **Use descriptive remote names** (e.g., "work_drive", "personal_backup")
- **Monitor transfer output** for any errors or warnings
- **Break large transfers** into smaller chunks if needed

### Performance Tips:
- Server-side transfers are fastest for Google Drive to Google Drive
- Adjust parallel transfers based on file types (fewer for large files, more for small files)
- Use fast-list for directories with many files
- Monitor transfer speed and adjust settings accordingly

## 📊 What's New in the Enhanced Version

### UI/UX Improvements
- **Modern interface** with color-coded sections and better styling
- **Real-time validation** with immediate feedback
- **Command preview** showing exactly what will be executed
- **Enhanced status indicators** with color-coded messages
- **Directory browser** for exploring remote file systems

### Functionality Enhancements
- **Integrated configuration creation** - no local rclone installation needed
- **Multiple authentication methods** - built-in OAuth or custom credentials
- **Advanced transfer options** - update existing files, enhanced logging
- **Comprehensive validation** - catch errors before starting transfers
- **Better error handling** - more helpful error messages and recovery suggestions

### User Experience
- **Progressive disclosure** - show options as users progress through steps
- **Contextual help** - tooltips and guidance throughout the interface
- **Smart defaults** - optimized settings for most common use cases
- **Flexible workflows** - support both novice and advanced users

## 🤖 Automated Development Status

*Last updated: 8/4/2025, 12:00:16 AM by Continuous Coding Agent*

### 🎯 Current Development Tasks

1. **Add error handling to notebook**
   - Type: feature
   - Priority: medium
   - Estimated: 4h
   - Description: Improve error handling and user feedback in the Google Drive transfer notebook

### 📊 Development Metrics

- Active tasks: 1
- Total estimated hours: 4h
- Agent status: ✅ Active

*This section is automatically maintained by the continuous coding agent workflow.*

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter issues or have questions:
1. Check the enhanced troubleshooting section above
2. Use the built-in validation tools in Step 3
3. Review the [rclone documentation](https://rclone.org/drive/)
4. Open an issue on this repository

---

*Enhanced Google Drive Transfer Tool with robust UI and integrated configuration management*

*Made with ❤️ for seamless cloud storage management*
