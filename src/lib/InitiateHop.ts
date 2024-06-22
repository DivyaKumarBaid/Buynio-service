import { brandCreationDto } from "src/hops/dto";

// type InitialHopType = {
//   brandName: string;
// };

export const initiateHop = (props: brandCreationDto) => {
  return {
    brandName: props.brandName,
    logo: props.logo,
    currency: "INR",
    backgroud: "#fff",
    nav: {
      sticky: true,
      background: "#000",
      headerFontColor: "#000",
      linkFontColor: "#eee",
      linkFontStyle: "poppins",
      headerFontStyle: "poppins",
      type: "FLOATINGNAV",
      links: [{ link: "String", redirection: "String" }],
      collapsable: true,
      logo: props.logo,
      brandName: props.brandName,
    },
    headerConfig: {
      fontStyle: "poppins",
      fontColor: "#fff",
    },
    textConfig: {
      fontStyle: "poppins",
      fontPrimaryColor: "#fff",
      fontSecondaryColor: "#eee",
    },
    section: [],
  };
};

export interface Blueprint {
  brand: string;
}

// {
//     nav: {
//         sticky: Boolean,
//         background: String,
//         headerFontColor : String,
//         linkFontColor : String,
//         linkFontStyle : String,
//         headerFontStyle : String,
//         type: String,
//         links : {link: String, redirection: String}[],
//         collapsable : Boolean,
//         logo: String,
//         brandName: String
//     },
//     brandName: String,
//     logo: String,
//     currency: String,
//     backgroud: String,
//     header: {
//         fontStyle: String,
//         fontColor: String
//     }
//     text: {
//         fontStyle: String,
//         fontPrimaryColor: String,
//         fontSecondaryColor: String
//     },
//     sections:[
//         {
//             sectionType: Hero,
//             subType: String,
//             config: {
//                 images: String[],
//                 delay: Number,
//                 autoScrollEnabled: Boolean,
//                 userScrollEnabled: Boolean,
//             }
//             | {
//                 image: String,
//             }
//             | {
//                 heading: String,
//                 description: String,
//                 Button text: String,
//                 redirectTo : String,
//                 image : String,
//                 background: String,
//             }
//         },
//         {
//             sectionType: Product,
//             subType: String
//             config: {
//                 description: String,
//                 name: String,
//                 variants: {
//                     name: String,
//                     images: String[],
//                     price: Number,
//                     discount: Number(in percentage),
//                     variantDescription: String
//                 }[],
//                 defaultVariant:{
//                     name: String,
//                     images: String[],
//                     price: Number,
//                     discount: Number(in percentage),
//                     variantDescription: String
//                 }
//             }
//         },
//         {
//             sectionType: FeaturedProduct,
//             subType: String
//             config: {
//                 description: String,
//                 name: String,
//                 variants: {
//                     name: String,
//                     images: String[],
//                     price: Number,
//                     discount: Number(in percentage),
//                     variantDescription: String,
//                     tag: type["New", "Latest", "Trending", "Limited"]
//                 }[],
//                 defaultVariantIndex: Number,
//             }
//         }
//     ]
// }

// enum Section = {
//     NAV
//     Hero
//     FeaturedProduct
//     Products
//     aboutUs
//     testimonials
//     sponsors
//     stats
// }
