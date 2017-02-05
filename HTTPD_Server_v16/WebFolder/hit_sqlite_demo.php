<?php

$db = new SQLite3('test.db.txt');
$results = $db->query('SELECT * FROM customer');

$bJSON = true;
$bHTML = false;

if($bJSON)
{
while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
$jsonDataTxt[]=$row;
}
print json_encode($jsonDataTxt);
}

if($bHTML)
{
echo "<table>";

while ($row = $results->fetchArray()) {

echo "<tr>";

echo "<td>" . $row['customer_id'] . "</td>";
echo "<td>" . $row['title'] . "</td>";
echo "<td>" . $row['fname'] . "</td>";
echo "<td>" . $row['lname'] . "</td>";

echo "</tr>";

}
echo "</table>";
}

?>