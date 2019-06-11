# Initial Network Configuration
When a new Cloud Organization is created, it initially has no networks configured.  This is done for security reasons so that by default, any virtual machines created are isolated from the outside world.  Your Cloud Organization also has a VMware Edge Gateway appliance assigned to it, which will be used to provide internet access, firewall, NAT, and VPN functionality to your virtual machines. Additional layers of security are made available to customers through the osCloud Next Generation Firewal as a Service product line powered by Palo Alto Networks.

## Creation of an Org VDC Network
The first network that should be created is an organization-level Virtual Datacenter network.  To do so, click on the Network link in the Network menu on the left side of the screen:

![](assets/portal/2-network.png)

Then, click the Add button on the next screen:

![](assets/portal/3-network-add.png)

This will bring you to the “Add Org VDC Network” screen, which will look similar to this one:

![](assets/portal/4-network-orgvdc-add.png)

These settings should be configured as follows:
- **Org VDC**: This should already be set to the name of your virtual datacenter. If not, select yours from the drop-down menu.
- **Name**: This can be any name you want to use to reference this network in the future.
- **Description**: Optional description of this network.
- **Share this network with other VDCs**: This will only affect you have multiple virtual datacenters, which is not common.
- **Type**: For this first network, select “Routed network” to create a network that will connect to the Edge Gateway and can reach the internet. Additional networks may be created as either Isolated (internal-only) or routed.
- **Edge Gateway**: Your organization will already have an Edge Gateway deployed. Click on it to select it as the Edge Gateway that this network will connect to.
- **Allow Guest VLAN and Create as Subinterface**: Most clients will leave these unchecked.
- **Gateway address**: This is the internal IP that you want your VMs to connect to in order to reach the internet – such as 192.168.20.1.
- **Network mask**: This should match the subnet size you wish to use, such as 255.255.255.0.
- **Primary and Secondary DNS**: Set these to the IPs of the domain name servers you wish to use.
- **DNS Suffix**: If you need a specific DNS suffix for your local VMs, enter it here.
- **Static IP pool**: If you want to identify a pool of IPs that will be reserved as static IPs, enter the IP range here in the format shown on the screen, such as 192.168.20.10 – 192.168.20.100.

Click “Save” to commit these settings.

## Edge Gateway Configuration
To access the Edge Gateway configuration screen, click on the “Edges” item in the menu on the left side of the screen:

![](assets/portal/5-edge-gateway.png)

This will show you a list of Edge Gateways configured on your account. In most cases, your account will only have one listed, with your organization’s name assigned to it:

![](assets/portal/6-edge-summary.png)

Clicking on the Edge Gateway itself will show the current Edge Gateway Settings, and will also enable the “Configure Services” button. Click the “Configure Services” button to manage the Edge Gateway virtual appliance.

This will open up the Edge Gateway Services Screen. The Firewall rules will already have a few entries pre-built as part of pre-configured services, which you should not need to change in most cases:

![](assets/portal/7-edge-firewall.png)

To allow traffic either inbound (internet to VM) or outbound (VM to internet), you will need to create both NAT rules and Firewall rules.

## Managing NAT Rules
We recommend starting with the NAT rules. Click on the “NAT” link in the top part of the screen to view and manage NAT rules:

![](assets/portal/8-edge-nat.png)

By default you will not have any NAT rules set up – this example organization already has some created as part of configuring an IPSEC VPN.

## Creating a Source NAT Rule
To allow traffic from your VMs to reach the internet, click on the “SNAT Rule” button to add a SNAT (Source NAT) rule.

![](assets/portal/9-edge-snat.png)

These settings should be configured as:
- **Applied On**: This should default to your Edge Gateway’s pre-configured external network.
- **Original Source IP/Range**: This will be the same internal IP and subnet as defined earlier, such as 192.168.20.0/24.
- **Translated Source IP/Range**: This will be the external IP that you want traffic to show up as. You will need to enter one of your usable public IPs here.
- **Description**: An optional text description of the rule.
- **Enabled**: This should be enabled by default.
- **Enable logging**: Optional logging of traffic matching this rule.

Click “Keep” to commit these settings.

## Creating a Destination NAT Rule
If you want to allow traffic from the internet to directly reach one of your virtual machines, you will need to create a DNAT rule to translate the public IP and port to a private IP and port. Click on the “DNAT Rule” button to add a DNAT (Destination NAT) rule.

![](assets/portal/10-edge-dnat.png)

These settings should be configured as:
- **Applied On**: This should default to your Edge Gateway’s pre-configured external network.
- **Original IP/Range**: This will be the public IP your external users will use to connect.
- **Protocol**: This will be the IP protocol type that will be mapped with this NAT rule.
- **Original Port or ICMP Type**: One or both of these will be greyed out depending on the setting chosen in Protocol. This is used to identify the type of traffic that will be mapped with this rule.
- **Translated IP/Range**: This will be the internal IP of the virtual machine that you want this traffic to reach.
- **Translated Port**: The port on the virtual machine that this traffic should be sent to.
- **Description**: An optional text description of the rule.
- **Enabled**: This should be enabled by default.
- **Enable logging**: Optional logging of traffic matching this rule.

Click “Keep” to commit these settings.

## Creating Firewall Rules
With the NAT rules created, Firewall rules matching this traffic must also be created so that the traffic matching these NAT rules will be allowed through. To start creating a rule, click on the “+” button. This will enter a new rule in the list as shown below:

![](assets/portal/11-edge-firewall.png)

The firewalls rules are directly edited on this screen.  Double-clicking on a field will allow you to edit the contents of that field.  The process for creating and editing a rule is the same whether you are editing a rule for SNAT or DNAT traffic, only the settings themselves will change.  These rules are only shown as examples. You will need to consider your own desired network configuration before applying rules to your environment.

An example rule to allow all traffic from VMs to reach the internet:
- **Name**: Egress traffic
- **Type**: User
- **Source**: Internal IP range (such as 192.168.20.0/24)
- **Destination**: Any
- **Service**: Any
- **Action**: Accept

An example rule to allow inbound traffic to port 443 on a virtual machine:
- **Name**: HTTPS
- **Type**: User
- **Source**: Any
- **Destination**: Internal IP of the VM serving HTTPS
- **Service**: tcp:443:any
- **Action**: Accept

You can also use the up and down arrow buttons at the top of the screen to re-order rules.  Traffic will be handled by the first rule that it matches.  For example, if you have a “deny all inbound” traffic rule, this should be the last rule after all rules that specifically allow certain types of inbound traffic.

Click “Save changes” on the right side of the screen to apply the firewall rules to your Edge Gateway.
