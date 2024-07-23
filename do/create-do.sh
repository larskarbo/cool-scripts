#!/bin/bash


random_letters=$(cat /dev/urandom | base64 | tr -dc 'a-z' | head -c1)
random_numbers=$(cat /dev/urandom | base64 | tr -dc '0-9' | head -c2)

prefix="${random_letters}${random_numbers}"
suffix="temporary-droplet-docker"
droplet_name="${prefix}-${suffix}"
ssh_config_file="$HOME/.ssh/config"

get_ssh_key_id() {
	doctl compute ssh-key list --format "ID" --no-header
}

    # --size s-2vcpu-4gb-amd \
	# s-8vcpu-16gb-amd
doctl compute droplet create \
    --image ubuntu-24-04-x64 \
    --size g-16vcpu-64gb \
    --region fra1 \
    --vpc-uuid 029aaf65-3e9e-4743-be81-730e1be518f3 \
	--ssh-keys $(get_ssh_key_id) \
    --enable-monitoring \
	--project-id b311e508-2b30-4124-9434-2b9e9c78988d \
    $droplet_name

# Function to retrieve the IP address
get_droplet_ip() {
    doctl compute droplet get "$droplet_name" --format "PublicIPv4" --no-header
}


# Function to add the droplet to SSH config
add_to_ssh_config() {
    local ip_address=$1
    local host_entry="$droplet_name"
    local user="root"

    echo "Host $host_entry" >> "$ssh_config_file"
    echo "Hostname $ip_address" >> "$ssh_config_file"
    echo "User $user" >> "$ssh_config_file"
    echo "" >> "$ssh_config_file"
}

# Continuously poll for the IP address
while true; do
    ip_address=$(get_droplet_ip)

    if [[ -n "$ip_address" ]]; then
        echo "Droplet IP address: $ip_address"

        # Check if the entry already exists in SSH config
        if ! grep -q "Host $droplet_name" "$ssh_config_file"; then
            add_to_ssh_config "$ip_address"
            echo "Added droplet to SSH config."
			echo Run this command:
			echo bash ./init-do.sh $ip_address $droplet_name
        else
            echo "Droplet already exists in SSH config."
        fi

        break
    else
        echo "Waiting for droplet IP address..."
        sleep 5
    fi
done
