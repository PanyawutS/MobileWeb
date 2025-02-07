const RB = ReactBootstrap;
const { Alert, Card, Button, Table } = ReactBootstrap;

class App extends React.Component {
  title = (
    <Alert variant="info">
      <b>Work6 :</b> Firebase with React
    </Alert>
  );
  footer = (
    <div>
      By 653380138-3 ปัญญาวุธ แสงแดง <br />
      College of Computing, Khon Kaen University
    </div>
  );
  state = {
    students: [],
    stdid: "",
    stdtitle: "",
    stdfname: "",
    stdlname: "",
    stdemail: "",
    stdphone: "",
    user: null,
  };

  constructor() {
    super();
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
        this.readData();
      } else {
        this.setState({ user: null, students: [] });
      }
    });
  }

  google_login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    this.auth.signInWithPopup(provider);
  }

  google_logout() {
    if (confirm("Are you sure?")) {
      this.auth.signOut();
    }
  }

  readData() {
    this.db
      .collection("students")
      .get()
      .then((querySnapshot) => {
        var stdlist = [];
        querySnapshot.forEach((doc) => {
          stdlist.push({ id: doc.id, ...doc.data() });
        });
        this.setState({ students: stdlist });
      });
  }

  autoRead() {
    this.db.collection("students").onSnapshot((querySnapshot) => {
      var stdlist = [];
      querySnapshot.forEach((doc) => {
        stdlist.push({ id: doc.id, ...doc.data() });
      });
      this.setState({ students: stdlist });
    });
  }

  insertData() {
    if (!this.state.stdid) {
      alert("กรุณาใส่รหัสนักศึกษา");
      return;
    }

    this.db
      .collection("students")
      .doc(this.state.stdid)
      .set(
        {
          title: this.state.stdtitle,
          fname: this.state.stdfname,
          lname: this.state.stdlname,
          phone: this.state.stdphone,
          email: this.state.stdemail,
        },
        { merge: true }
      ) // ใช้ merge เพื่ออัปเดตข้อมูลเฉพาะฟิลด์ที่เปลี่ยน
      .then(() => {
        alert("บันทึกข้อมูลสำเร็จ");
        this.readData(); // โหลดข้อมูลใหม่
        this.clearForm(); // เคลียร์ฟอร์ม
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  }

  edit(std) {
    this.setState({
      stdid: std.id,
      stdtitle: std.title || "",
      stdfname: std.fname || "",
      stdlname: std.lname || "",
      stdemail: std.email || "",
      stdphone: std.phone || "",
    });
  }

  clearForm() {
    this.setState({
      stdid: "",
      stdtitle: "",
      stdfname: "",
      stdlname: "",
      stdemail: "",
      stdphone: "",
    });
  }

  delete(std) {
    if (confirm("ต้องการลบข้อมูล")) {
      this.db.collection("students").doc(std.id).delete();
    }
  }

  render() {
    if (!this.state.user) {
      return (
        <Card>
          <Card.Header>{this.title}</Card.Header>
          <Card.Body className="text-center">
            <Alert variant="info">Please login to access student data</Alert>
            <Button onClick={() => this.google_login()} variant="primary">
              Login with Google
            </Button>
          </Card.Body>
          <Card.Footer>{this.footer}</Card.Footer>
        </Card>
      );
    }

    return (
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            {this.title}
            <Button onClick={() => this.google_logout()} variant="danger">
              Logout
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <h5>Welcome, {this.state.user.displayName}</h5>
          <Button onClick={() => this.readData()} className="me-2">
            Read Data
          </Button>
          <Button onClick={() => this.autoRead()} variant="success">
            Auto Read
          </Button>
          <StudentTable data={this.state.students} app={this} />
        </Card.Body>
        <Card.Footer>
          <b>เพิ่ม/แก้ไขข้อมูล นักศึกษา :</b>
          <br />
          <TextInput
            label="ID"
            app={this}
            value="stdid"
            style={{ width: 120 }}
          />
          <TextInput
            label="คำนำหน้า"
            app={this}
            value="stdtitle"
            style={{ width: 100 }}
          />
          <TextInput
            label="ชื่อ"
            app={this}
            value="stdfname"
            style={{ width: 120 }}
          />
          <TextInput
            label="สกุล"
            app={this}
            value="stdlname"
            style={{ width: 120 }}
          />
          <TextInput
            label="Email"
            app={this}
            value="stdemail"
            style={{ width: 150 }}
          />
          <TextInput
            label="Phone"
            app={this}
            value="stdphone"
            style={{ width: 120 }}
          />
          <Button onClick={() => this.insertData()}>Save</Button>
        </Card.Footer>
        <Card.Footer>{this.footer}</Card.Footer>
      </Card>
    );
  }
}

function StudentTable({ data, app }) {
  return (
    <Table striped bordered hover className="mt-3">
      <thead>
        <tr>
          <th>รหัส</th>
          <th>คำนำหน้า</th>
          <th>ชื่อ</th>
          <th>สกุล</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((s) => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.title}</td>
            <td>{s.fname}</td>
            <td>{s.lname}</td>
            <td>{s.email}</td>
            <td>
              <Button
                variant="warning"
                size="sm"
                onClick={() => app.edit(s)}
                className="me-2"
              >
                แก้ไข
              </Button>
              <Button variant="danger" size="sm" onClick={() => app.delete(s)}>
                ลบ
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function TextInput({ label, app, value, style }) {
  return (
    <label className="form-label">
      {label}:
      <input
        className="form-control"
        style={style}
        value={app.state[value]}
        onChange={(ev) => {
          var s = {};
          s[value] = ev.target.value;
          app.setState(s);
        }}
      ></input>
    </label>
  );
}
function EditButton({ std, app }) {
  return <button onClick={() => app.edit(std)}>แก้ไข</button>;
}
function DeleteButton({ std, app }) {
  return <button onClick={() => app.delete(std)}>ลบ</button>;
}

function LoginBox(props) {
  const u = props.user;
  const app = props.app;
  if (!u) {
    return (
      <div>
        <button onClick={() => app.google_login()}>Login</button>
      </div>
    );
  } else {
    return (
      <div>
        {u.email}
        <button onClick={() => app.google_logout()}>Logout</button>
      </div>
    );
  }
}

// ใช้ config จาก เว็บ Firebase: Project Setting
const firebaseConfig = {
  apiKey: "AIzaSyAxk8IUqqdzXt4WMaMI5_TajQsIMbYzAj0",
  authDomain: "web2567-bd33e.firebaseapp.com",
  projectId: "web2567-bd33e",
  storageBucket: "web2567-bd33e.firebasestorage.app",
  messagingSenderId: "860170359998",
  appId: "1:860170359998:web:4309b3116a99805f777aef",
  measurementId: "G-CN0N35RD2P",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);
