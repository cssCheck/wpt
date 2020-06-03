// META: title=Synchronous NativeIO API: File renaming is reflected in listing.
// META: global=dedicatedworker

'use strict';

test(testCase => {
  const file = nativeIO.openSync('test_file');
  testCase.add_cleanup(() => {
    file.close();
    nativeIO.deleteSync('test_file');
    nativeIO.deleteSync('new_name');
  });
  file.close();

  const fileNamesBeforeRename = nativeIO.getAllSync();
  assert_in_array('test_file', fileNamesBeforeRename);

  nativeIO.renameSync('test_file', 'new_name');
  const fileNamesAfterRename = nativeIO.getAllSync();
  assert_equals(fileNamesAfterRename.indexOf('test_file'), -1);
  assert_in_array('new_name', fileNamesAfterRename);
}, 'nativeIO.getAllSync does not return a file renamed by nativeIOFileSync.rename with its new name.');

test(testCase => {
  const file = nativeIO.openSync('test_file');
  const file2 = nativeIO.openSync('test_file_2');
  testCase.add_cleanup(() => {
    file.close();
    file2.close();
    nativeIO.deleteSync('test_file');
    nativeIO.deleteSync('test_file_2');
  });
  file.close();
  file2.close();

  assert_throws_dom("UnknownError", () => nativeIO.renameSync('test_file', 'test_file_2'));

  const fileNamesAfterRename = nativeIO.getAllSync();
  assert_in_array('test_file', fileNamesAfterRename);
  assert_in_array('test_file_2', fileNamesAfterRename);

  const file3 = nativeIO.openSync('test_file');
  file3.close();
}, 'nativeIOFileSync.rename overwrites an existing file.');

test(testCase => {
  const file = nativeIO.openSync('test_file');
  testCase.add_cleanup(() => {
    file.close();
    nativeIO.deleteSync('test_file');
  });
  assert_throws_dom("UnknownError", () => nativeIO.renameSync('test_file', 'new_name'));
  file.close();

  const fileNamesAfterRename = nativeIO.getAllSync();
  assert_equals(fileNamesAfterRename.indexOf('new_name'), -1);
  assert_in_array('test_file', fileNamesAfterRename);
}, 'nativeIOFileSync.rename allows renaming an open file.');
