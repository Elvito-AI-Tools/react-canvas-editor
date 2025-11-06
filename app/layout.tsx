import type { Metadata } from "next";
import { 
  Geist, 
  Geist_Mono,
  Inter,
  Roboto,
  Open_Sans,
  Lato,
  Montserrat,
  Poppins,
  Playfair_Display,
  Merriweather,
  Oswald,
  Raleway,
  PT_Sans,
  Bebas_Neue,
  Dancing_Script,
  Pacifico,
  Righteous,
  Permanent_Marker,
  Lobster,
  Anton,
  Satisfy,
  Great_Vibes,
  Abril_Fatface,
  Cinzel,
  Caveat,
  Indie_Flower,
  Sacramento,
  Tangerine,
  Courgette,
  Amatic_SC,
  Kalam,
  Cookie,
  Allura,
  Alex_Brush,
  Parisienne,
  Ballet,
  Kaushan_Script,
  Yellowtail,
  Shadows_Into_Light,
  Patrick_Hand,
  Architects_Daughter,
  Fredoka,
  Comfortaa,
  Quicksand,
  Nunito,
  Rubik,
  Work_Sans,
  DM_Sans,
  Josefin_Sans,
  Epilogue,
  Space_Grotesk,
  Crimson_Text,
  Lora,
  EB_Garamond,
  Cormorant_Garamond,
  Libre_Baskerville,
  Staatliches,
  Russo_One,
  Fredericka_the_Great,
  Bungee,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Load Google Fonts for text editor
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

const ptSans = PT_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-pt-sans",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
});

const pacifico = Pacifico({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: "swap",
});

const righteous = Righteous({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-righteous",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-permanent-marker",
  display: "swap",
});

const lobster = Lobster({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-lobster",
  display: "swap",
});

const anton = Anton({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const satisfy = Satisfy({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-satisfy",
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

const abrilFatface = Abril_Fatface({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-abril-fatface",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const indieFlower = Indie_Flower({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-indie-flower",
  display: "swap",
});

const sacramento = Sacramento({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-sacramento",
  display: "swap",
});

const tangerine = Tangerine({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-tangerine",
  display: "swap",
});

const courgette = Courgette({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-courgette",
  display: "swap",
});

const amaticSC = Amatic_SC({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-amatic-sc",
  display: "swap",
});

const kalam = Kalam({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-kalam",
  display: "swap",
});

const cookie = Cookie({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-cookie",
  display: "swap",
});

const allura = Allura({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-allura",
  display: "swap",
});

const alexBrush = Alex_Brush({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-alex-brush",
  display: "swap",
});

const parisienne = Parisienne({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-parisienne",
  display: "swap",
});

const ballet = Ballet({
  subsets: ["latin"],
  variable: "--font-ballet",
  display: "swap",
});

const kaushanScript = Kaushan_Script({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-kaushan-script",
  display: "swap",
});

const yellowtail = Yellowtail({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-yellowtail",
  display: "swap",
});

const shadowsIntoLight = Shadows_Into_Light({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-shadows-into-light",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-patrick-hand",
  display: "swap",
});

const architectsDaughter = Architects_Daughter({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-architects-daughter",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin-sans",
  display: "swap",
});

const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-epilogue",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-crimson-text",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
  display: "swap",
});

const staatliches = Staatliches({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-staatliches",
  display: "swap",
});

const russoOne = Russo_One({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-russo-one",
  display: "swap",
});

const frederickaTheGreat = Fredericka_the_Great({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-fredericka-the-great",
  display: "swap",
});

const bungee = Bungee({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bungee",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allFontVariables = [
    geistSans.variable,
    geistMono.variable,
    inter.variable,
    roboto.variable,
    openSans.variable,
    lato.variable,
    montserrat.variable,
    poppins.variable,
    playfairDisplay.variable,
    merriweather.variable,
    oswald.variable,
    raleway.variable,
    ptSans.variable,
    bebasNeue.variable,
    dancingScript.variable,
    pacifico.variable,
    righteous.variable,
    permanentMarker.variable,
    lobster.variable,
    anton.variable,
    satisfy.variable,
    greatVibes.variable,
    abrilFatface.variable,
    cinzel.variable,
    caveat.variable,
    indieFlower.variable,
    sacramento.variable,
    tangerine.variable,
    courgette.variable,
    amaticSC.variable,
    kalam.variable,
    cookie.variable,
    allura.variable,
    alexBrush.variable,
    parisienne.variable,
    ballet.variable,
    kaushanScript.variable,
    yellowtail.variable,
    shadowsIntoLight.variable,
    patrickHand.variable,
    architectsDaughter.variable,
    fredoka.variable,
    comfortaa.variable,
    quicksand.variable,
    nunito.variable,
    rubik.variable,
    workSans.variable,
    dmSans.variable,
    josefinSans.variable,
    epilogue.variable,
    spaceGrotesk.variable,
    crimsonText.variable,
    lora.variable,
    ebGaramond.variable,
    cormorantGaramond.variable,
    libreBaskerville.variable,
    staatliches.variable,
    russoOne.variable,
    frederickaTheGreat.variable,
    bungee.variable,
  ].join(" ");

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${allFontVariables} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
