killall rclone 
rclone mount gcache: /media/gdrive --allow-non-empty --allow-other --cache-db-purge --buffer-size 1G --use-mmap --dir-cache-time 72h --drive-chunk-size 1G --timeout 2h --vfs-cache-mode minimal --vfs-read-chunk-size 1G --vfs-read-chunk-size-limit 10G --config /root/yours-mine/packages/rclone/rclone.conf
