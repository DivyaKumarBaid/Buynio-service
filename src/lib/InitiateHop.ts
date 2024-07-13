import { brandCreationDto } from "src/hops/dto";

// type InitialHopType = {
//   brandName: string;
// };

export const initiateHop = (props: brandCreationDto) => {
  return JSON.stringify(blueprint(props));
};

export interface Blueprint {
  brand: string;
}

// brandName
// companyName
// officialPhone
// officialEmail
// customerServicePhone
// customerServiceEmail
// logo
// instagramAccount
// facebookAccount
// otherAccount
// description
// privacyPolicy
// motto
// category
// link

export const blueprint = (props: brandCreationDto) => {
  return {
    GENERAL: {
      brandName: props.brandName,
      logo: props.logo,
      currency: "INR",
      background: "#101010",
      ...props,
    },
    NAVBAR: {
      isSticky: true,
      background: "#000",
      headerFontColor: "#fff",
      linkFontColor: "#eee",
      linkFontStyle: "poppins",
      headerFontStyle: "poppins",
      type: "NAV_V3",
      links: [
        { link: "Instagram", redirection: "https://insta" },
        { link: "Instagram", redirection: "https://insta" },
      ],
      collapsable: true,
      logo: props.logo,
      logoSize: 20,
      logoVisibility: true,
      headerVisibility: true,
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
    SECTIONS: [
      {
        type: "CAROUSEL",
        backgroud: "#121212",
        subType: "CAROUSEL_V1",
        config: {
          images: [
            {
              title: "Baby",
              redirection: "https://divyakrbaid.me",
              src: "https://images.unsplash.com/photo-1704326163357-cf0a659c226c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              title: "Baby2",
              redirection: "https://divyakrbaid.me",
              src: "https://images.unsplash.com/photo-1683009427666-340595e57e43?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8",
            },
          ],
          sliderBtnColor: "#fff",
          interval: 5000,
        },
      },
      {
        type: "CAROUSEL",
        backgroud: "#121212",
        subType: "CAROUSEL_V1",
        config: {
          images: [
            {
              title: "Baby",
              redirection: "https://divyakrbaid.me",
              src: "https://images.unsplash.com/photo-1704326163357-cf0a659c226c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              title: "Baby2",
              redirection: "https://divyakrbaid.me",
              src: "https://images.unsplash.com/photo-1683009427666-340595e57e43?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8",
            },
          ],
          sliderBtnColor: "#fff",
          interval: 5000,
        },
      },
    ],
  };
};
