const { Console } = require('console');
const { google } = require('googleapis');
const keys = require('./keys.json');

const client = new google.auth.JWT(
    keys.client_email, null,
    keys.private_key, ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function (err, tokens) {

    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Conectado');
        gsRun(client);
    }
});


async function gsRun(cl) {

    const gs = google.sheets({ version: 'v4', auth: cl });

    //gets the spreedsheetId and sets the range for the alterations;
    const opt = {
        spreadsheetId: '1miJ24cRTLMVeWwV1r9PHt53jsKqtY5O4QXfcVLUbDXI',
        range: 'engenharia_de_software!A4:H'
    };


    let data = await gs.spreadsheets.values.get(opt);
    let dataArray = data.data.values;
    let newDataArray = dataArray.map(function (r) {
        //r.push(r[0] + '-' + r[1]);
        return r;
    });

    //fill the 7th column with 0s;
    let newDataArray2 = dataArray.map((newDataArray2) => {
        newDataArray2[7] = 0;
        return newDataArray2;
    });

    //updates the spreedsheet
    const updateOp = {
        spreadsheetId: '1miJ24cRTLMVeWwV1r9PHt53jsKqtY5O4QXfcVLUbDXI',
        range: 'engenharia_de_software!A4:I',
        valueInputOption: 'User_Entered',
        resource: { values: newDataArray }
    };

    let res = gs.spreadsheets.values.update(updateOp);
    //console.log(res);

    //beginning of the functions
    dataArray.map((dataArray) => {

        //function for the 'reprovado por falta' 
        if (dataArray[2] > (60 / 100 * 25)) {

            dataArray[6] = 'Reprovado por falta'
            //prints in the log the name and status 'reprovado por falta'
            console.log(`${dataArray[1]}  ${'Reprovado por Falta'}`);

        }

        //function for the 'reprovado por nota' 
        else {
            //console.log(dataArray[1] + 'Reprovado por Nota');
            var m = ((parseInt(dataArray[3]) + parseInt(dataArray[4]) + parseInt(dataArray[5])) / 3);
            //console.log(m);
            if (m < 50) {


                dataArray[6] = 'Reprovado por Nota';
                //prints in the log the name and status 'reprovado por nota'
                console.log(`${dataArray[1]}  ${'Reprovado por Nota'}`);

            }

            //function for the 'exame final' and 'nota para aprovação final(naf)'
            else

                if ((50 <= m && m < 70)) {


                    dataArray[6] = 'Exame Final';

                    var naf1 = ((100 - m));
                    naf = Math.ceil(naf1);
                    dataArray[7] = naf;
                    //prints in the log the name, status 'exame final' and the nota para aprovação final(naf)
                    console.log(`${dataArray[1]}  ${'Exame Final:'}  ${naf}`);



                }

                //function for the 'aprovado'
                else {


                    dataArray[6] = 'Aprovado';
                    //prints in the log the name and status 'aprovado'
                    console.log(`${dataArray[1]} ${'Aprovado'}`);
                }

        }
    }

    );
}



