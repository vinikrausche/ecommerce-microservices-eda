export type Product = {
  id: string
  title: string
  price: string
  installment?: string
  quantity: string
  description: string
  material?: string
  sole?: string
  color?: string
  photos: string[]
  highlights: string[]
  details: { label: string; value: string }[]
}

export const placeholderImage = (label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" viewBox="0 0 900 700">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#D8CFC4"/>
          <stop offset="100%" stop-color="#B9A998"/>
        </linearGradient>
      </defs>
      <rect width="900" height="700" fill="url(#bg)"/>
      <rect x="140" y="140" width="520" height="300" rx="28" fill="#121212" opacity="0.9"/>
      <rect x="200" y="210" width="420" height="190" rx="20" fill="#6B3E26" opacity="0.85"/>
      <text x="150" y="520" fill="#121212" font-family="Georgia, serif" font-size="36" letter-spacing="3">BOTA</text>
      <text x="150" y="570" fill="#121212" font-family="Georgia, serif" font-size="18" letter-spacing="5">${label}</text>
    </svg>`
  )}`

export const mockProducts: Product[] = [
  {
    id: "bota-01",
    title: "Bota Chelsea Couro Legítimo",
    price: "R$ 689",
    installment: "ou 10x de R$ 68,90",
    quantity: "12 unidades",
    description:
      "Uma chelsea essencial para o guarda-roupa masculino. Couro macio, acabamento artesanal e sola que garante estabilidade em qualquer piso urbano.",
    material: "Couro premium",
    sole: "Solado emborrachado",
    color: "Marrom café",
    photos: [
      placeholderImage("CHELSEA"),
      placeholderImage("LATERAL"),
      placeholderImage("DETALHE"),
    ],
    highlights: ["Couro premium", "Forro respirável", "Elástico reforçado"],
    details: [
      { label: "Cor", value: "Marrom café" },
      { label: "Solado", value: "Emborrachado antiderrapante" },
      { label: "Altura do cano", value: "13 cm" },
    ],
  },
  {
    id: "bota-02",
    title: "Bota Tratorada Explorer",
    price: "R$ 749",
    installment: "ou 10x de R$ 74,90",
    quantity: "8 unidades",
    description:
      "Modelo robusto e moderno para quem precisa de presença. Solado tratorado, couro encerado e costuras reforçadas.",
    material: "Couro encerado",
    sole: "Solado tratorado",
    color: "Carvão",
    photos: [
      placeholderImage("EXPLORER"),
      placeholderImage("TRATOR"),
      placeholderImage("CANO"),
    ],
    highlights: ["Couro encerado", "Solado tratorado", "Palmilha anatômica"],
    details: [
      { label: "Cor", value: "Carvão" },
      { label: "Solado", value: "Tratorado em borracha" },
      { label: "Altura do cano", value: "15 cm" },
    ],
  },
  {
    id: "bota-03",
    title: "Bota Clássica Urban",
    price: "R$ 619",
    installment: "ou 10x de R$ 61,90",
    quantity: "15 unidades",
    description:
      "Uma bota clássica com visual limpo e elegante. Ideal para combinações formais e casuais.",
    material: "Couro macio",
    sole: "Solado costurado",
    color: "Conhaque",
    photos: [
      placeholderImage("URBAN"),
      placeholderImage("COSTURA"),
      placeholderImage("INTERIOR"),
    ],
    highlights: ["Couro macio", "Costura reforçada", "Design atemporal"],
    details: [
      { label: "Cor", value: "Conhaque" },
      { label: "Solado", value: "Costurado artesanalmente" },
      { label: "Altura do cano", value: "12 cm" },
    ],
  },
]
