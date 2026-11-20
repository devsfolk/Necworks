type TitleBlockProps = {
  company: string;
  sheet: string;
  title: string;
  labels: {company: string; sheet: string; title: string};
};

export function TitleBlock({company, sheet, title, labels}: TitleBlockProps) {
  const fields = [
    {label: labels.company, value: company},
    {label: labels.sheet, value: sheet},
    {label: labels.title, value: title}
  ];
  return (
    <dl className="title-block" aria-label={`${labels.title}: ${title}`}>
      {fields.map(({label, value}) => (
        <div className="title-block__field" key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
