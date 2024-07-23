
# Check if arguments are passed
if [ "$#" -ne 2 ]; then
    echo "Illegal number of parameters. You need to specify the IP address and hostname."
    exit 1
fi

# get ip address from args
ip_address=$1

# Validate IP address
if ! [[ $ip_address =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Invalid IP address: $ip_address"
    exit 1
fi

# get hostname from args
do_service_name=$2

# ↓ these should be run through ssh

# add docker
ssh root@$ip_address "wget -O - https://gist.githubusercontent.com/fredhsu/f3d927d765727181767b3b13a3a23704/raw/3c2c55f185e23268f7fce399539cb6f1f3c45146/ubuntudocker.sh | bash"

# set up caddy
ssh root@$ip_address "mkdir caddy"

ssh root@$ip_address "cd caddy && echo '
services:
    caddy:
        image: caddy:latest
        restart: unless-stopped
        ports:
            - \"80:80\"
            - \"443:443\"
            - \"443:443/udp\"
        volumes:
            - ./Caddyfile:/etc/caddy/Caddyfile
            - ./site:/srv
            - ./data:/data
            - ./config:/config
        extra_hosts:
            - \"host.docker.internal:host-gateway\"
        environment:
            - CADDY_WATCH_CONFIG=true
        command: caddy run --watch --config /etc/caddy/Caddyfile
' > docker-compose.yml"

ssh root@$ip_address "cd caddy && echo \"
$do_service_name.larskarbo.no {
	\# Set this path to your site's directory.
	root * /usr/share/caddy

	\# Enable the static file server.
	file_server

	\# Another common task is to set up a reverse proxy:
	\# reverse_proxy host.docker.internal:8080
}
\" > Caddyfile"
