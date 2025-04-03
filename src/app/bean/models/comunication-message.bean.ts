export class ComunicationMessageRS {

    public code?: string; // IDX_ID
    public originType?: string; // DAT_TIP_ORIGEN
    public date?: Date; // DAT_FECHA
    public centerCode?: string; // DAT_CENTRO_COD
    public centerDesc?: string; // DAT_CENTRO_DESC
    public serviceDoctorCode?: string; // DAT_SERVICIO_MEDICO_COD
    public serviceDoctorDesc?: string; // DAT_SERVICIO_MEDICO_DESC
    public userID?: string; // DAT_USUARIO_ID
    public userDesc?: string; // DAT_USUARIO_DESC
    public read?: string; // DAT_LEIDO
    public readDate?: Date; // DAT_LEIDO_FECHA
    public readCenterCode?: string; // DAT_LEIDO_CENTRO_COD
    public readCenterDesc?: string; // DAT_LEIDO_CENTRO_DESC
    public readServiceDoctorCode?: string; // DAT_LEIDO_SERVICIO_MEDICO_COD
    public readServiceDoctorDesc?: string; // DAT_LEIDO_SERVICIO_MEDICO_DESC
    public readUserID?: string; // DAT_LEIDO_USUARIO_ID
    public readUserDesc?: string; // DAT_LEIDO_USUARIO_DESC
    public requestgroupID?: string; // DAT_REQUESTGROUP_ID
    public cipa?: string; // DAT_CIPA
    public patientName?: string; // DAT_PACIENTE_NOMBRE
    public textMessage?: string; // DAT_TEXTO
}
