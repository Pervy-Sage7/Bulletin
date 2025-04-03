function beep(name,role)
{
    


    switch(role)
    {
        case "admin":
            return `${name} is admin`
            break;

            case "subadmin":
            return `${name} is subadmin`
            break;

            case "employee":
            return `${name} is employee`
            break;

            default:
                return `${name}is a trial user`
    }
    
    }
    
console.log(beep("Kali","admin"));
var role=beep("Riya","admin");

console.log(role);


