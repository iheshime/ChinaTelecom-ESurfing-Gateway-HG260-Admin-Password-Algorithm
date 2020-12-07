# ChinaTelecom E-surfing 2.0 ONU / Gateway HG260 Password Algorithm

## 1. Background

E-surfing 2.0 gateway is the Optical Network Unit (ONU) device for each ChinaTelecom broadband users. Normally we don't need to access it, but for these senior users who need DMZ, NAT or port forwarding, the E-surfing 2.0 gateway blocked them out to change settings.

To access these pro features in the E-surfing 2.0 gateway, we need to access the telecom administrator account. This file described how to calculate the password of telecom administrator account.

**Note**

1. All scripts in this file are tested on **FiberHome HG2821T-U** device.
2. Please don't be evil and don't do anything illegal, use this tool only for your own device.

## 2. Theory

The ChinaTelecom gateway device allows us to log in with **UserAdmin** account. After we logged in, we can access its **baseinfoSet** file by visiting [192.168.1.1:8080/cgi-bin/baseinfoSet.cgi](http://192.168.1.1:8080/cgi-bin/baseinfoSet.cgi). The output JSON file provides both username and password for **UserAdmin** and **TelecomAdmin**. Because the device encoding these passwords with the same algorithm and only accept numbers and letters, we can guess the algorithm by changing our **UserAdmin** password.

```JSON
{
    "RETURN":
    {
        "success": true
    },
    "BASEINFOSET":
    {
        "baseinfoSet_INTERNETMAC":"",
        "baseinfoSet_TR069MAC":"",
        "baseinfoSet_VOIPMAC":"",
        "baseinfoSet_PRIPROTOCOLMAC":"",
        "baseinfoSet_WLANMAC":"",
        "baseinfoSet_PONMAC":"",
        "baseinfoSet_INTERNETEN":"",
        "baseinfoSet_TR069EN":"",
        "baseinfoSet_VOIPEN":"", 
        "baseinfoSet_PRIPROTOCOLEN":"", 
        "baseinfoSet_PONEN":"",  
        "baseinfoSet_TELECOMACCOUNT":"telecomadmin",
        "baseinfoSet_TELECOMPASSWORD":"86&49&72&101&54&98&102&51&",
        "baseinfoSet_USERACCOUNT":"useradmin",
        "baseinfoSet_USERPASSWORD":"108&100&72&54&105&56&48&86&",
        "baseinfoSet_MANUFACTUREROUI":"",  
        "baseinfoSet_DEVICESERIALNUMBER":"",
        "baseinfoSet_Compiletime":"",
        "baseinfoSet_SOFTWAREVERSION":"21FHT45008001",
        "baseinfoSet_EXTNUMBER":"",
        "baseinfoSet_HARDWAREVERSION":"",
        "baseinfoSet_HARDWARECODE":"",
        "baseinfoSet_SSID":"",
        "baseinfoSet_WPAKEY":"",
        "baseinfoSet_REGSTATUS":"",
        "baseinfoSet_GPONSN":"",
        "baseinfoSet_GPONPASSWORD":"",
        "baseinfoSet_PONMODE":"",
        "baseinfoSet_BRMAC":"",
        "baseinfoSet_area":"Sichuan",
        "baseinfoSet_IMAGEID":"",
        "baseinfoSet_PreconfigID":"",
        "baseinfoSet_factory":"",
        "baseinfoSet_factorymode":"",
        "wirelessenable":""
    }
}
```

## 3. Algorithm

After a few tests, now we can decode the **TelecomAdmin** password by using the following scripts.

```Javascript
"use strict";

const decode = (digit) => {
    let tempCode = Number.parseInt(digit);

    if (Number.isNaN(tempCode))
        return "";

    if (tempCode >= 48 && tempCode <= 57)
        return String.fromCodePoint(tempCode);
    else if ([65, 66, 67, 68, 97, 98, 99, 100].includes(tempCode))
        tempCode -= (4 - 26);
    else
        tempCode -= 4;

    return String.fromCodePoint(tempCode);
}

// USAGE
const testString = "86&49&72&101&54&98&102&51&";
console.log(testString.split("&").map(x => (decode(x))).join("")); // R1Da6xb3
```

:vulcan_salute:
