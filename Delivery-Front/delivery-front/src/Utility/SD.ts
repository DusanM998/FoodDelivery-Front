export enum SD_Roles {
    ADMIN = "admin",
    CUSTOMER = "customer",
}

export enum SD_Status {
    CEKANJE = "Čekanje",
    POTVRDJENA = "Potvrđena",
    PRIPREMA_SE = "Priprema se",
    SPREMNA_ZA_ISPORUKU = "Spremna za isporuku",
    ZAVRSENA = "Isporučena",
    OTKAZANA = "Otkazana",
}

export enum SD_Categories {
    Americka = "Americka",
    BrzaHrana = "Brza Hrana",
    Dezert = "Dezert",
    Dorucak = "Dorucak",
    Azijska = "Azijska",
    Grickalice = "Grickalice",
    Italijanska = "Italijanska",
    Meso = "Meso",
    Peciva = "Peciva",
    Pice = "Piće",
    Zdravo = "Zdrava Hrana",
    Slatkisi = "Slatkiši",
    Salate = "Salate",
    Predjelo = "Predjelo",
}

export enum SD_SortTypes {
    Cena_Opadajuce = "Cena: Najviša - Najniža",
    Cena_Rastuce = "Cena: Najniža - Najviša",
    Naziv_A_Z = "Naziv: A - Z",
    Naziv_Z_A = "Naziv: Z - A",
}