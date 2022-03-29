process.chdir(__dirname);

const package_info = require('./package.json');
const debug = require('../debug');

debug.log('Imported', package_info.name);

const fs = require('fs');
// Todo: Add Path Module
//const path = require('path');
const execSpawn = require('child_process').spawn;

exports=function (source, mount_dir, config_file, check_file=".checkfile", is_trash=false) {
  var spawn = execSpawn('rclone', ['mount',source,mount_dir,"--allow-non-empty","--allow-other", "--config",config_file]);
  spawn.stdout.on('data', function(msg){         
    debug.log(msg.toString(), package_info.name);
  });
  spawn.stdout.on('error', function(msg){         
    debug.error(msg.toString(), package_info.name);
    process.exit(1);
  });
  spawn.stdout.on('close', function(msg){         
    debug.log(msg.toString(), package_info.name);
    process.exit(0);
  });
  
  if (0) {
    //if (!fs.existsSync(mount_dir)) {
    //  debug.log('Create Mount Dir: '+mount_dir, package_info.name);
    //  fs.mkdirSync(mount_dir,{recursive:true});
    //}

    if (is_trash) {
      var spawn = execSpawn('rclone', ['mount',source,mount_dir,"--drive-trashed-only","--allow-non-empty","--allow-other", "--config",config_file]);   
    } else {
      var check_path=mount_dir+"/"+check_file;
      if (!fs.existsSync(check_path)) {
        debug.log('No Checkfile: '+check_path, package_info.name);

        var spawn = execSpawn('rclone', ['mount',source,mount_dir,"--allow-non-empty","--allow-other", "--config",config_file]);     
        spawn.stdout.on('data', function(msg){         
          debug.log(msg.toString(), package_info.name);
        });
        spawn.stdout.on('error', function(msg){         
          debug.error(msg.toString(), package_info.name);
          process.exit(1);
        });
        spawn.stdout.on('close', function(msg){         
          debug.log(msg.toString(), package_info.name);
          process.exit(0);
        });

        /*
        setTimeout(() => {
          const time = new Date();
          try {
            fs.utimesSync(check_path, time, time);
          } catch (err) {
            fs.closeSync(fs.openSync(check_path, 'w'));
          }
        },5000);
        */
        exports(source, mount_dir+"_trash",config_file,check_file,true);
      }
    }
  }
}

//rclone mount hervenn:/ /media/.hervenn --allow-non-empty --allow-other --config /home/pi/.config/rclone/rclone.conf &
//rclone mount hervenn:/ /media/.htrash --drive-trashed-only --allow-non-empty --allow-other --config /home/pi/.config/rclone/rclone.conf &
exports("PI:/", "/media/pi","/root/.config/rclone/rclone.conf");