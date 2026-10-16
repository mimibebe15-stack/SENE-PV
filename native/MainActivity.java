package com.sene.puntodeventas2026;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(android.os.Bundle savedInstanceState) {
    registerPlugin(InventoryFilePlugin.class);
    super.onCreate(savedInstanceState);
  }
}
