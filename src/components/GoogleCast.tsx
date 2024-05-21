const GoogleCast = (cast) => {
  return (
    <>
      <>
        <script
          type="text/javascript"
          src="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"
        ></script>
        <google-cast-launcher id="castbutton"></google-cast-launcher>
      </>
    </>
  );
};

export default GoogleCast;
