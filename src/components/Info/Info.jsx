function Info(props) {
  return (
    <div>
      {props.selectedStateInfo.statename == 'default' ? (
        <h2>Information about Legislation</h2>
      ) : (
        <h2>
          Information about Legislation in {props.selectedStateInfo.statename}
        </h2>
      )}
      <p>{props.selectedStateInfo.text}</p>
    </div>
  );
}

export default Info;
