type InitialHopType = {
    brandName: string;
}

export const initiateHop = ({brandName}:InitialHopType) => {
    return ({
        "brandName": brandName
      })
}

export interface Blueprint{
    brand: string
}


// {
//     brand: String,
//     navBarType: String,
//     layout:
//     [
//         [
//             {
//                 componentType: String
//                 componentDetails: {}
//             },

//         ]
//     ]
// }