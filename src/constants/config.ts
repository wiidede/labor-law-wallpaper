export const DEFAULT_CONF = {
  intervalTime: 6,

  guohuiSize: isMobile ? '180px' : '240px',
  nameSize: isMobile ? '52px' : '72px',
  articleSize: isMobile ? '18px' : '24px',

  containerBg: '#DB3832',
  containerColor: '#FFFF54',

  topMargin: '0px',
  centerTopMargin: '0px',
  centerBottomMargin: '0px',
  bottomMargin: '0px',
  bottomDoubleWeight: true,

  nameWrap: true,
}

export const DEFAULT_LAW: Record<string, string | undefined> = {
  中华人民共和国劳动法: '00010000000000000000000000000000000100000001000000000000000000000000000000000000000000000000000000000000000',
  中华人民共和国劳动合同法: '00010010000000000000000001000010001001000000000000000000000000000000000000000000000000000000000000',
  中华人民共和国劳动争议调解仲裁法: '000001000000000000000000000000000000000000000000000000',
}
