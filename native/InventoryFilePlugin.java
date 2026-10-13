package com.sene.puntodeventas2026;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Base64;

import androidx.core.content.FileProvider;

import com.getcapacitor.ActivityCallback;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.activity.ActivityResult;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

@CapacitorPlugin(name = "InventoryFile")
public class InventoryFilePlugin extends Plugin {
  @PluginMethod
  public void save(PluginCall call) {
    String filename = call.getString("filename");
    String data = call.getString("data");
    if (filename == null || data == null) {
      call.reject("Falta el archivo de inventario");
      return;
    }
    Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
    intent.addCategory(Intent.CATEGORY_OPENABLE);
    intent.setType("application/json");
    intent.putExtra(Intent.EXTRA_TITLE, filename);
    startActivityForResult(call, intent, "saveResult");
  }

  @ActivityCallback
  private void saveResult(PluginCall call, ActivityResult result) {
    if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
      call.reject("No se eligió una ubicación para guardar");
      return;
    }
    try {
      Uri uri = result.getData().getData();
      byte[] bytes = Base64.decode(call.getString("data"), Base64.DEFAULT);
      OutputStream output = getContext().getContentResolver().openOutputStream(uri);
      output.write(bytes);
      output.close();
      JSObject response = new JSObject();
      response.put("uri", uri.toString());
      call.resolve(response);
    } catch (Exception error) {
      call.reject("No se pudo guardar el inventario", error);
    }
  }

  @PluginMethod
  public void share(PluginCall call) {
    String filename = call.getString("filename");
    String data = call.getString("data");
    if (filename == null || data == null) {
      call.reject("Falta el archivo de inventario");
      return;
    }
    try {
      File folder = new File(getContext().getCacheDir(), "sene-inventory");
      folder.mkdirs();
      File file = new File(folder, filename);
      FileOutputStream output = new FileOutputStream(file);
      output.write(Base64.decode(data, Base64.DEFAULT));
      output.close();
      Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", file);
      Intent intent = new Intent(Intent.ACTION_SEND);
      intent.setType("application/json");
      intent.putExtra(Intent.EXTRA_STREAM, uri);
      intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
      startActivity(Intent.createChooser(intent, "Enviar inventario SENE/P.V"));
      call.resolve();
    } catch (Exception error) {
      call.reject("No se pudo compartir el inventario", error);
    }
  }
}
