import { SD_Status } from "../Utility/SD";

const getStatusColor = (status: SD_Status) => {
    return status === SD_Status.POTVRDJENA ? "primary"
    : status === SD_Status.CEKANJE ? "secondary"
    : status === SD_Status.OTKAZANA ? "danger"
    : status === SD_Status.ZAVRSENA ? "success"
    : status === SD_Status.PRIPREMA_SE ? "info"
    : status === SD_Status.SPREMNA_ZA_ISPORUKU && "warning";
}

export default getStatusColor;