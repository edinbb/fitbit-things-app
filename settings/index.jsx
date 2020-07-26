function settingsComponent(props) {
  return (
    <Page>
      <Section
        description={<Text> Create your personal access token <Link source="https://account.smartthings.com/tokens">here</Link>.
        Personal access token scopes are associated with specific permissions authorized for the token.</Text>}
        title={<Text bold align="left">PERSONAL ACCESS TOKEN</Text>}>
        <TextInput
          title="Authorization token"
          placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
          settingsKey="token"
          action="Save"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(settingsComponent);
