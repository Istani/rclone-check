process.chdir(__dirname);

const package_info = require('./package.json');
const debug = require('../debug');

debug.log('Imported', package_info.name);

const fs = require('fs');
// Todo: Add Path Module
const path = require('path');
const cp = require('child_process');

var link_process = null;
var trash_process = null;
var link2_process = null;

class RcloneMount {
  constructor(config, source, mount_dir, check_file = '.checkfile') {
    this.config = config;
    this.source = source;
    this.mount_dir = mount_dir;
    this.setCheckfile(check_file);
    this.setConfig(config);

    this.unmountSource();

    setInterval(() => {
      this.isConnected();
    }, 5000);
  }

  setCheckfile(check_file) {
    this.check_file = check_file;
  }
  setConfig(config) {
    this.config = config;
    if (typeof this.config == 'undefined' || this.config == '') {
      debug.error("Config isn't set!", package_info.name);
      return;
    }
    if (!fs.existsSync(this.config)) {
      debug.error('Config File doenst exists!', package_info.name);
      return;
    }
  }

  isConnected() {
    var returnvalue = false;
    var checkpath = path.join(this.mount_dir, this.check_file);
    try {
      if (this.isMountReady()) {
        if (fs.existsSync(checkpath)) {
          returnvalue = true;
        } else {
          debug.error("Can't Find Checkfile: " + checkpath, package_info.name);
        }
      }
    } catch (e) {
      debug.error(e, package_info.name);
    }
    return returnvalue;
  }

  isMountReady() {
    var returnvalue = false;
    try {
      if (fs.existsSync(this.mount_dir)) {
        returnvalue = true;
      } else {
        fs.mkdirSync(this.mount_dir, { recursive: true });
        fs.mkdirSync(this.mount_dir + '_trash', { recursive: true });
        returnvalue = true;
      }
    } catch (e) {
      debug.error(e, package_info.name);
    }
    if (returnvalue == false) {
      this.unmountSource();
    }
    return returnvalue;
  }

  unmountSource() {
    try {
      cp.execSync('fusermount -uz ' + this.mount_dir);
      cp.execSync('fusermount -uz ' + this.mount_dir + '_trash');
      // ? this.isMountReady();
    } catch (e) {
      debug.error(e, package_info.name);
      this.isMountReady();
    }
    this.mountSource();
  }

  // https://bytesized-hosting.com/pages/rclone-gdrive
  //    &

  // ! https://rclone.org/cache/
  mountSource() {
    if (link_process == null) {
      debug.log('Spawn Mount Process', package_info.name);
      link_process = cp.exec('sh /root/yours-mine/packages/rclone/test.sh');
      link2_process = cp.exec('sh /root/yours-mine/packages/rclone/test2.sh');
      /*
      cp.spawn('rclone', [
        'mount',
        this.source,
        this.mount_dir,

        '--allow-non-empty',
        '--allow-other',

        '--cache-db-purge',
        '--buffer-size',
        '64M',
        '--use-mmap',
        '--dir-cache-time',
        '72h',
        '--drive-chunk-size',
        '32M',
        '--timeout',
        '1h',
        '--vfs-cache-mode minimal',
        '--vfs-read-chunk-size',
        '128M',
        '--vfs-read-chunk-size-limit',
        '1G',

        '--config',
        this.config,
      ]);
      */

      /*
      trash_process = cp.spawn('rclone', [
        'mount',
        this.source,
        this.mount_dir + '_trash',
        '--drive-trashed-only',
        '--allow-non-empty',
        '--allow-other',
        '--config',
        this.config,
      ]);
      */

      link_process.stdout.on('data', function (msg) {
        debug.log('1data:' + msg.toString(), package_info.name);
      });

      link_process.stdout.on('error', function (msg) {
        debug.error('1error:' + msg.toString(), package_info.name);
        process.exit(1);
      });

      link_process.stdout.on('close', function (msg) {
        debug.log('1close:' + msg.toString(), package_info.name);
        process.exit(0);
      });

      link2_process.stdout.on('data', function (msg) {
        debug.log('2data:' + msg.toString(), package_info.name);
      });

      link2_process.stdout.on('error', function (msg) {
        debug.error('2error:' + msg.toString(), package_info.name);
        process.exit(1);
      });

      link2_process.stdout.on('close', function (msg) {
        debug.log('2close:' + msg.toString(), package_info.name);
        //process.exit(0);
      });

      /*
      trash_process.stdout.on('data', function (msg) {
        debug.log('data:' + msg.toString(), package_info.name);
      });

      trash_process.stdout.on('error', function (msg) {
        debug.error('error:' + msg.toString(), package_info.name);
        process.exit(1);
      });

      trash_process.stdout.on('close', function (msg) {
        debug.log('close:' + msg.toString(), package_info.name);
        process.exit(0);
      });
      */
    }
  }
}

// Todo:  das als Import-Modul laufen lassen?
//        damit man dort leicht abfragen kann ob gemountet ist?!?
var rcm = new RcloneMount(
  __dirname + '/rclone.conf',
  'gcache:/',
  '/media/gdrive'
);
