export const convertDateString = (dateString: string) => {
  const yyyy = dateString.substring(0, 4);
  const mm = dateString.substring(4, 6);
  const dd = dateString.substring(6, 8);
  const HH = dateString.substring(8, 10);
  const MM = dateString.substring(10, 12);
  return `${yyyy}년 ${mm}월 ${dd}일 ${HH}시 ${MM}분`;
};