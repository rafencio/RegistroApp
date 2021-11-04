import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DBTaskService {

  db: SQLiteObject = null;

  constructor() { }

  setDatabase(db: SQLiteObject) {
    if(this.db === null) {
      this.db = db;
    };
  }

  createTables(): Promise<any> {
    let tables = `
      CREATE TABLES IF NOT EXIST sesion_data 
      (
        user_name TEXT PRIMARY KEY NOT NULL,
        password INTERGER NOT NULL,
        active INTERGER(1) NOT NULL
      ); 
      CREATE TABLE IF NOT EXIST experiencia
      (
        id NUMBER PRIMARY KEY AUTOINCREMENT,
        empresa TEXT NOT NULL,
        anio_inicio TEXT NOT NULL,
        trabajo_actual INTERGER(1) NOT NULL,
        anio_ternimo TEXT, 
        cargo TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXIST certificacion
      (
        id NUMBER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        fecha_obtencion TEXT NOT NULL,
        vencimiento INTERGER(1) NOT NULL,
        fecha_vencimiento TEXT
      );`;
    return this.db.executeSql(tables);
  }

  sesionActive() {
    const sql = `SELECT user_name, active FROM sesion_data WHERE active=1 LIMIT 1`;
    return this.db.executeSql(sql,[])
      .then(response => {
        return Promise.resolve(response.rows.item(0))
      });

  }

  /**
   * @param
   */
  getSesionData(sesion: any) {
    const sql = `
      SELECT user_name, active FROM sesion_data
      WHERE user_name=? AND password=? LIMIT 1`;
      return this.db.executeSql(sql, [sesion.Usuario, sesion.Password])
        .then(response => {
          return Promise.resolve(response.rows.item(0))
        });
}

  /**
   * @param
   */
  createSesionData(sesion: any) {
    const sql = `
      INSERT INTO sesion_data(user_name,password,active)
      VALUES(?,?,?)`;
    
    return this.db.executeSql(sql, [sesion.Usuario, sesion.Password, sesion.Active])
      .then(response => {
        return Promise.resolve(response.rows.item(0))
      });  
  }

  updateSesionData(sesion: any) {
    const sql = `UPDATE sesion_data 
    SET active=? 
    WHERE user_name=?`;
    return this.db.executeSql(sql, [sesion.active, sesion.user_name]);
  }

}
